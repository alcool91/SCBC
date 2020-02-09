pragma solidity ^0.4.0;

//imports

//Alpha contract written by Evelyn May Fitzpatrick

contract validateFabrication {
    /* Define a variable greeting of the type string */
    string public inspector;
    string public inspectorNumber;
    uint256 public timeOfLastUpdate;
	int public chipNumber;
	bool public inspectionCheck;
	bool public inspectionPass;

    /* this is the constructor */
    function validateFabrication() public {
        inspector = "Default";
		inspectorNumber = "Default";
		chipNumber = 0;
		inspectionCheck = false;
		inspectionPass = false;
		timeOfLastUpdate = now; //now records the current number of seconds since janurary 1st 1970
    }

    function Addeverything(string inspectorName, string inspectorNum, int chipNum, bool inspectionPassResult) public {
        inspector = inspectorName;
        inspectorNumber = inspectorNum;
        chipNumber = chipNum;
        inspectionCheck = true;
        inspectionPass = inspectionPassResult;
        timeOfLastUpdate = now;
    }

    function getLatest()constant public returns (string) {
        return inspector;
    }
}
