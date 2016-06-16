import json
from math import *
from numpy import *

with open('input.txt') as data_file:
    data2 = json.load(data_file)


#using the free space path loss model with constant set to measure frequency in megahertz and distance in meters, using fixed frequency 2412 mHz for our antennas
def powtodist(power):
    exponent = (27.55 - 20 * 3.38237730347 + abs(power))/20
    return pow(10, exponent)


json_data2 = json.dumps(data2)
json_object2 = json.loads(json_data2)
#at this point we parse incoming data into a directory for easy access
#load local variables for calculation


#this is the only data we need for one round of computing

def comploc(inclist):
#first we convert power into distance
#the signal field values are !!overwritten!! with the distance in meters

    inclist[0]["signal"] = powtodist(inclist[0]["signal"])
    inclist[1]["signal"] = powtodist(inclist[1]["signal"])
    inclist[2]["signal"] = powtodist(inclist[2]["signal"])
    inclist[3]["signal"] = powtodist(inclist[3]["signal"])


#we create the scenario that we want to solve for
#we define the equation matrix and the corresponding constraint vector using a 4 reference point approximation with mean square error estimation
#M is the coefficient matrix, V is the constraint vector

    M = matrix([[inclist[3]["x"] - inclist[0]["x"], inclist[3]["y"] - inclist[0]["y"]], [inclist[3]["x"] - inclist[1]["x"], inclist[3]["y"] - inclist[1]["y"]], [inclist[3]["x"] - inclist[2]["x"], inclist[3]["y"] - inclist[2]["y"]]])
    M=2*M

    V = matrix( [[(pow(inclist[0]["signal"],2) - pow(inclist[3]["signal"],2)) - (pow(inclist[0]["x"],2) - pow(inclist[3]["x"],2)) - (pow(inclist[0]["y"],2) - pow(inclist[3]["y"],2))],[((pow(inclist[1]["signal"],2) - pow(inclist[3]["signal"],2))) - (pow(inclist[1]["x"],2) - pow(inclist[3]["x"],2)) - (pow(inclist[1]["y"],2) - pow(inclist[3]["y"],2))],[(pow(inclist[2]["signal"],2) - pow(inclist[3]["signal"],2)) - (pow(inclist[2]["x"],2) - pow(inclist[3]["x"],2)) - (pow(inclist[2]["y"],2) - pow(inclist[3]["y"],2))]] ) 


#we calculate the mean square error estimation of the location
    MT = M.getT()
    L1 = (MT*M).getI()
    S = L1*MT*V

#the estimation result is the vector S with x and y coordinate
    return S[0, 0], S[1, 0]

#now its time for the functions that handle the data structure

#first we compile a list of the different macadresses present in the data
def complist(inc):
    maclist = []
    for i in range(len(inc)):
        for j in range(len(inc[i]["data"])):
            if not ({"mac":inc[i]["data"][j]["mac"], "essid":inc[i]["data"][j]["essid"]} in maclist):
                maclist.append({"mac":inc[i]["data"][j]["mac"], "essid":inc[i]["data"][j]["essid"]})	
    return maclist

#for a given mac we collect the 4 best nodes, we pass on the reference of the data object
def selectnodes(inmac, data):
    selected = []
    for i in range(len(data)):
        for j in range(len(data[i]["data"])):
            if (inmac == data[i]["data"][j]["mac"]):
                if (len(selected) < 4):
                    selected.append({"x":data[i]["x"], "y":data[i]["y"],"name":data[i]["data"][j]["essid"],"signal":data[i]["data"][j]["power"]})                 
    return selected

#with all parts present this method does the high level work
def main(bigdata):
    result = []
    # we first compile a list of the macadresses present and iterate over it afterwards
    macs = complist(bigdata)
    for i in range(len(macs)):
        #at this point we could first filter mac adresses belonging to parrot, this part might be imperfect im relying on google
        if (macs[i]["mac"][:8] == "A0:14:3D" or macs[i]["mac"][:8] == "90:03:B7" or macs[i]["mac"][:8] == "00:26:7E" or macs[i]["mac"][:8] == "00:12:1C"):
            if (len(selectnodes(macs[i]["mac"], bigdata)) == 4):
                #print selectnodes(macs[i]["mac"], bigdata)
                #print comploc((selectnodes(macs[i]["mac"], bigdata)))
                result.append({"x":comploc((selectnodes(macs[i]["mac"], bigdata)))[0], "y":comploc((selectnodes(macs[i]["mac"], bigdata)))[1], "mac":macs[i]["mac"], "essid":macs[i]["essid"]})
    return result

with open ('output.txt','w') as f:
    json.dump(main(json_object2),f)	
