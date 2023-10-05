// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract Insurance {
    uint256 public policyNumber;
    uint256 public insuredIdCounter;
    uint256 public vehicleIdCounter;
    uint256 public driverIdCounter;

    struct Insured {
        string firstName;
        string lastName;
        string dob;
    }

    struct Vehicle {
        string vehType;
        string vin;
        string annualMileage;
    }

    struct Driver {
        string license;
        string ageLicensed;
    }

    struct Coverage {
        string liability;
        string comprehensive;
        string collision;
        uint256 coverage;
    }

    struct Policy {
        uint256 insuredId;
        uint256 vehicleId;
        uint256 driverId;
        Coverage coverage;
        string effectiveDate;
        string polTerm;
        bool isActive;
    }

    mapping(uint256 => Insured) public insured;
    mapping(uint256 => Vehicle) public vehicles;
    mapping(uint256 => Driver) public drivers;
    mapping(uint256 => Policy) public policies;
    mapping(string => string) public polDetails;

    event PolicyCreated(
        uint256 policyNumber,
        uint256 insuredId,
        uint256 vehicleId,
        uint256 driverId,
        string liability,
        string comprehensive,
        string collision,
        uint256 coverage,
        string effectiveDate,
        string polTerm
    );

    event InsuredCreated(string firstName, string lastName, string dob);

    constructor() {
        policyNumber = 999999;
        insuredIdCounter = 0;
        vehicleIdCounter = 0;
        driverIdCounter = 0;
    }

    function createInsured(
        string memory _firstName,
        string memory _lastName,
        string memory _dob
    ) external returns (uint256) {
        insuredIdCounter++;
        insured[insuredIdCounter] = Insured(_firstName, _lastName, _dob);
        emit InsuredCreated(_firstName, _lastName, _dob);
        return insuredIdCounter;
    }

    function createVehicle(
        string memory _vType,
        string memory _vin,
        string memory _mileage
    ) external returns (uint256) {
        vehicleIdCounter++;
        vehicles[vehicleIdCounter] = Vehicle(_vType, _vin, _mileage);
        return vehicleIdCounter;
    }

    function createDriver(
        string memory _licenseNum,
        string memory _ageLicensed
    ) external returns (uint256) {
        driverIdCounter++;
        drivers[driverIdCounter] = Driver(_licenseNum, _ageLicensed);
        return driverIdCounter;
    }

    function createPolicy(
        uint256 _insuredId,
        uint256 _vehicleId,
        uint256 _driverId,
        string memory _liability,
        string memory _comprehensive,
        string memory _collision,
        uint256 _coverage,
        string memory _effectiveDate,
        string memory _polterm
    ) external returns (uint256) {
        policyNumber++;

        policies[policyNumber] = Policy(
            _insuredId,
            _vehicleId,
            _driverId,
            Coverage(_liability, _comprehensive, _collision, _coverage),
            _effectiveDate,
            _polterm,
            true
        );

        emit PolicyCreated(
            policyNumber,
            _insuredId,
            _vehicleId,
            _driverId,
            _liability,
            _comprehensive,
            _collision,
            _coverage,
            _effectiveDate,
            _polterm
        );

        return policyNumber;
    }

    function getPolicy(
        uint256 _policyNumber
    )
        external
        view
        returns (
            uint256 insuredId,
            uint256 vehicleId,
            uint256 driverId,
            string memory liability,
            string memory comprehensive,
            string memory collision,
            uint256 coverage,
            string memory effectiveDate,
            string memory polTerm,
            bool isActive
        )
    {
        Policy storage policy = policies[_policyNumber];
        require(
            bytes(policy.coverage.liability).length > 0,
            "Policy does not exist."
        );

        insuredId = policy.insuredId;
        vehicleId = policy.vehicleId;
        driverId = policy.driverId;
        liability = policy.coverage.liability;
        comprehensive = policy.coverage.comprehensive;
        collision = policy.coverage.collision;
        coverage = policy.coverage.coverage;
        effectiveDate = policy.effectiveDate;
        polTerm = policy.polTerm;
        isActive = policy.isActive;
    }

    function getInsured(
        uint256 insuredId
    )
        external
        view
        returns (
            string memory firstName,
            string memory lastName,
            string memory dob
        )
    {
        Insured storage insuredDetails = insured[insuredId];
        require(
            bytes(insuredDetails.dob).length > 0,
            "Insured ID does not exist"
        );
        firstName = insuredDetails.firstName;
        lastName = insuredDetails.lastName;
        dob = insuredDetails.dob;
    }

    function getVehicleDetails(
        uint256 vehicleId
    )
        external
        view
        returns (
            string memory vehType,
            string memory vin,
            string memory mileage
        )
    {
        Vehicle storage vehicleDetails = vehicles[vehicleId];
        require(
            bytes(vehicleDetails.vin).length > 0,
            "Vehicle ID does not exist"
        );
        vehType = vehicleDetails.vehType;
        vin = vehicleDetails.vin;
        mileage = vehicleDetails.annualMileage;
    }

    function getDriverDetails(
        uint256 driverId
    )
        external
        view
        returns (string memory licenseNum, string memory ageLicensed)
    {
        Driver storage driverDetails = drivers[driverId];
        require(
            bytes(driverDetails.license).length > 0,
            "Driver ID does not exist"
        );
        licenseNum = driverDetails.license;
        ageLicensed = driverDetails.ageLicensed;
    }

    string public testReturn;

    function modifyPolicy(
        uint256 _policyNumber,
        string memory _modifyData
    ) external {
        Policy storage policy = policies[_policyNumber];
        require(
            bytes(policy.coverage.liability).length > 0,
            "Policy does not exist."
        );
        string[] memory splitedData = split(_modifyData, ",");
        for (uint256 i = 0; i < splitedData.length; i++) {
            string[] memory keyValue = split(splitedData[i], ":");
            polDetails[keyValue[0]] = keyValue[1];
        }
        Insured storage insuredDetails = insured[policy.insuredId];
        Vehicle storage vehicleDetails = vehicles[policy.vehicleId];
        Driver storage driverDetails = drivers[policy.driverId];

        if (
            keccak256(abi.encodePacked(polDetails["firstName"])) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            insuredDetails.firstName = polDetails["firstName"];
        }
        if (
            keccak256(abi.encodePacked(polDetails["lastName"])) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            insuredDetails.lastName = polDetails["lastName"];
        }
        if (
            keccak256(abi.encodePacked(polDetails["dob"])) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            insuredDetails.dob = polDetails["dob"];
        }

        if (
            keccak256(abi.encodePacked(polDetails["vehicleType"])) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            vehicleDetails.vehType = polDetails["vehicleType"];
        }
        if (
            keccak256(abi.encodePacked(polDetails["vin"])) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            vehicleDetails.vin = polDetails["vin"];
        }
        if (
            keccak256(abi.encodePacked(polDetails["mileage"])) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            vehicleDetails.annualMileage = polDetails["mileage"];
        }

        if (
            keccak256(abi.encodePacked(polDetails["license"])) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            driverDetails.license = polDetails["license"];
        }
        if (
            keccak256(abi.encodePacked(polDetails["ageLicensed"])) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            driverDetails.ageLicensed = polDetails["ageLicensed"];
        }

        string memory effdate = polDetails["effectiveDate"];
        string memory polTerm = polDetails["polTerm"];
        if (
            keccak256(abi.encodePacked(effdate)) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            policy.effectiveDate = effdate;
        }
        if (
            keccak256(abi.encodePacked(polTerm)) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            policy.polTerm = polTerm;
        }

        string memory liability = polDetails["liability"];
        string memory comp = polDetails["comp"];
        string memory collision = polDetails["collision"];
        string memory coverage = polDetails["coverage"];
        if (
            keccak256(abi.encodePacked(liability)) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            policy.coverage.liability = liability;
        }
        if (
            keccak256(abi.encodePacked(comp)) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            policy.coverage.comprehensive = comp;
        }
        if (
            keccak256(abi.encodePacked(collision)) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            policy.coverage.collision = collision;
        }
        if (
            keccak256(abi.encodePacked(coverage)) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            policy.coverage.coverage = stringToUint(coverage);
        }

        string memory isActiveStr = polDetails["isActive"];
        if (
            keccak256(abi.encodePacked(isActiveStr)) !=
            keccak256(abi.encodePacked("N/A"))
        ) {
            if (
                keccak256(abi.encodePacked(isActiveStr)) !=
                keccak256(abi.encodePacked("Active"))
            ) {
                policy.isActive = false;
            } else {
                policy.isActive = true;
            }
        }
    }

    function stringToUint(string memory str) public pure returns (uint256) {
        bytes memory b = bytes(str);
        uint256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            require(
                uint8(b[i]) >= uint8(bytes1("0")) &&
                    uint8(b[i]) <= uint8(bytes1("9")),
                "Invalid character in string"
            );
            result =
                result *
                10 +
                (uint256(uint8(b[i])) - uint256(uint8(bytes1("0"))));
        }
        return result;
    }

    function substring(
        string memory str,
        uint256 start,
        uint256 end
    ) internal pure returns (string memory) {
        bytes memory s = bytes(str);
        bytes memory result = new bytes(end - start + 1);
        for (uint256 i = 0; i <= end - start; i++) {
            result[i] = s[i + start];
        }
        return string(result);
    }

    function split(
        string memory str,
        string memory delimiter
    ) internal pure returns (string[] memory) {
        bytes memory strBytes = bytes(str);
        bytes memory delimiterBytes = bytes(delimiter);

        uint256 partsCount = 1;

        for (uint256 i = 0; i < strBytes.length; i++) {
            if (strBytes[i] == delimiterBytes[0]) {
                partsCount++;
            }
        }

        string[] memory parts = new string[](partsCount);

        uint256 startIndex = 0;
        uint256 partIndex = 0;

        for (uint256 i = 0; i < strBytes.length; i++) {
            if (strBytes[i] == delimiterBytes[0]) {
                parts[partIndex] = substring(str, startIndex, i - 1);
                startIndex = i + 1;
                partIndex++;
            }
        }

        parts[partIndex] = substring(str, startIndex, strBytes.length - 1);

        return parts;
    }
}
