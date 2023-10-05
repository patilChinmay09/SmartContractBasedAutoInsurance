import Web3 from 'web3';
import '../App.css';
import contractData from './contracts/AutoInsurance.json'
import calculateCoverage from './Coverage'

export default function ModifyPolicy() {
    // Connect to MetaMask
    let accountNumber;

    const connectMetamask = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                // eslint-disable-next-line no-undef
                const listAccounts = await ethereum.request({ method: "eth_requestAccounts" });
                accountNumber = listAccounts[0];
                console.log("Connected to MetaMask. Account number:", accountNumber);
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
            }
        } else {
            console.error("MetaMask is not installed or not available.");
        }
    };

    //Connect to Smart Contract
    const connectContract = async () => {
        const ABI = contractData.abi;
        const Address = contractData.address;

        window.web3 = await new Web3('http://localhost:7545');
        window.contract = await new window.web3.eth.Contract(ABI, Address);
        console.log("Connected to Smart Contract");
    }
    async function getPolicyDetailsClick() {
        await connectMetamask();
        await connectContract();
        const policyNumber = document.getElementById("polNum").value || "N/A";
        let policyData;
        try {
            policyData = await window.contract.methods.getPolicy(policyNumber).call();


            console.log(policyData)
            document.getElementById("effDate").value = policyData.effectiveDate;
            var termsEl = document.getElementsByName("term");
            var termVal = policyData.polTerm;
            for (let i = 0; i < termsEl.length; i++) {
                if (termsEl[i].value === termVal) {
                    termsEl[i].checked = true;
                }
            }
            document.getElementById("liability").value = policyData.liability;
            document.getElementById("comp").value = policyData.comprehensive;
            document.getElementById("collision").value = policyData.collision;
            document.getElementById("coverage").value = policyData.coverage;

            let insuredData = await window.contract.methods.getInsured(policyData.insuredId).call();
            console.log(insuredData);
            document.getElementById("fname").value = insuredData.firstName;
            document.getElementById("lname").value = insuredData.lastName;
            document.getElementById("dob").value = insuredData.dob;

            let vehicleData = await window.contract.methods.getVehicleDetails(policyData.vehicleId).call();
            console.log(vehicleData);
            document.getElementById("vtype").value = vehicleData.vehType;
            document.getElementById("vin").value = vehicleData.vin;
            document.getElementById("mileage").value = vehicleData.mileage;

            let driverData = await window.contract.methods.getDriverDetails(policyData.driverId).call();
            console.log(driverData)
            document.getElementById("license").value = driverData.licenseNum;
            document.getElementById("ageLicense").value = driverData.ageLicensed;

            var statusEl = document.getElementsByName("status");
            var statusVal = policyData.isActive;
            if (statusVal) {
                statusEl[0].checked = true;
            } else {
                statusEl[1].checked = true;
            }
        } catch (err) {
            alert("Policy Number does not exists!");
        }
    }

    async function modifyPolicyClick() {
        await connectMetamask();
        await connectContract();
        const policyNumber = document.getElementById("polNum").value || "N/A";
        const effectiveDate = document.getElementById("effDate").value || "N/A";
        const polTermRadio = document.getElementsByName("term");
        let polTerm;
        for (var i = 0; i < polTermRadio.length; i++) {
            if (polTermRadio[i].checked)
                polTerm = polTermRadio[i].value || "N/A";
        }
        const liability = document.getElementById("liability").value || "N/A";
        const comp = document.getElementById("comp").value || "N/A";
        const collision = document.getElementById("collision").value || "N/A";
        const fName = document.getElementById("fname").value || "N/A";
        const lName = document.getElementById("lname").value || "N/A";
        const dob = document.getElementById("dob").value || "N/A";
        const vehicleType = document.getElementById("vtype").value || "N/A";
        const vin = document.getElementById("vin").value || "N/A";
        const mileage = document.getElementById("mileage").value || "N/A";
        const license = document.getElementById("license").value || "N/A";
        const ageLicense = document.getElementById("ageLicense").value || "N/A";
        const polStatusRadio = document.getElementsByName("status");
        let polStatus;
        for (var i = 0; i < polStatusRadio.length; i++) {
            if (polStatusRadio[i].checked)
                polStatus = polStatusRadio[i].value || "N/A";
        }
        const coverage = calculateCoverage(liability, parseInt(comp), parseInt(collision), parseInt(ageLicense), parseInt(mileage), parseInt(polTerm));
        
        let polData = `effectiveDate:${effectiveDate},polTerm:${polTerm},firstName:${fName},lastName:${lName},dob:${dob},vehicleType:${vehicleType},vin:${vin},mileage:${mileage},license:${license},ageLicensed:${ageLicense},liability:${liability},comp:${comp},collision:${collision},isActive:${polStatus},coverage:${coverage.total}`;
        console.log(polData);
        const modifyTrans = await window.contract.methods.modifyPolicy(policyNumber, polData).send({
            from: accountNumber,
            gas: 3000000,
        });
        const driverId = await window.contract.methods.testReturn().call();
        console.log("Vehicle Id:", driverId);
        alert("Policy is updated successfully.")
        window.location.reload();
    }
    return (
        <div className="bg-slate-900 bdy">

            <div className="bg-slate-800 cntnr-1">

                <div>
                    <table className='policyTable'>
                        <tr>
                            <th>
                                <label htmlFor="polNum">Policy Number</label>
                            </th>
                            <td>
                                <input type="text" id="polNum" />
                            </td>
                            <td>
                                <button className="bg-cyan-500 details-btn" onClick={getPolicyDetailsClick}>Get Policy Details</button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div className="policyForm">
                    <div className="grid grid-cols-2 grid-rows-3 gap-15">
                        <div className="polDetails details col-span-2">
                            <h3 className='bg-slate-600 bloc-title'>Policy Details</h3>
                            <table>

                                <tr>
                                    <th>
                                        <label htmlFor="effDate">Effective Date</label>
                                    </th>
                                    <td>
                                        <input type="date" id="effDate" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <label htmlFor="polTerm">Policy Term</label>
                                    </th>
                                    <td>
                                        <input type="radio" name="term" id="term" value="6" />
                                        <label className="termLabel">06 Months</label>
                                        <br />
                                        <input type="radio" name="term" id="term" value="12" />
                                        <label className="termLabel">12 Months</label>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className="inusred details col-span-2 col-start-3">
                            <h3 className='bg-slate-600 bloc-title'>Insured Details</h3>
                            <table>
                                <tr>
                                    <th>
                                        <label htmlFor="fname">First Name</label>
                                    </th>
                                    <td>
                                        <input type="text" className="fname" id="fname" placeholder="First Name" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <label htmlFor="lname">Last Name</label>
                                    </th>
                                    <td>
                                        <input type="text" className="lname" id="lname" placeholder="Last Name" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <label htmlFor="dob">Date Of Birth</label>
                                    </th>
                                    <td>
                                        <input type="date" className="dob" id="dob" placeholder="Date Of Birth" />
                                    </td>
                                </tr>

                            </table>
                        </div>
                        <div className="vehicleDetails details col-span-2 row-start-2">
                            <h3 className='bg-slate-600 bloc-title'>Vehicle Details</h3>
                            <table>
                                <tr>
                                    <th>
                                        <label htmlFor="vtype">Vehicle Type</label>
                                    </th>
                                    <td>
                                        <select className="vtype" id="vtype">
                                            <option value=""></option>
                                            <option value="private">Private Passenger</option>
                                            <option value="pickup">Pickup</option>
                                            <option value="trailer">Trailer</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <label htmlFor="vin">VIN</label>
                                    </th>
                                    <td>
                                        <input type="text" className="vin" id="vin" placeholder="VIN" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <label htmlFor="mileage">Annual Mileage</label>
                                    </th>
                                    <td>
                                        <input type="text" className="mileage" id="mileage" placeholder="Annual Mileage" />
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className="driverDetails details col-span-2 col-start-3 row-start-2">
                            <h3 className='bg-slate-600 bloc-title'>Driver Details</h3>
                            <table>
                                <tr>
                                    <th>
                                        <label htmlFor="license">License No.</label>
                                    </th>
                                    <td>
                                        <input type="text" id="license" placeholder="License Number" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <label htmlFor="ageLicense">Age Licensed</label>
                                    </th>
                                    <td>
                                        <input type="text" id="ageLicense" placeholder="Age Licensed" />
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className="coverageDetails details col-span-2 row-start-3">
                            <h3 className='bg-slate-600 bloc-title'>Coverage Details</h3>
                            <table>
                                <tr>
                                    <th>
                                        <label htmlFor="liability">Liability</label>
                                    </th>
                                    <td>
                                        <select className="liability" id="liability">
                                            <option value=""></option>
                                            <option value="100/300">100/300</option>
                                            <option value="250/500">250/500</option>
                                            <option value="500/500">500/500</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <label htmlFor="comprehensive">Comprehenisve</label>
                                    </th>
                                    <td>
                                        <select className="comp" id="comp">
                                            <option value=""></option>
                                            <option value="0">FC</option>
                                            <option value="100">100</option>
                                            <option value="250">250</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <label htmlFor="collision">Collision</label>
                                    </th>
                                    <td>
                                        <select className="collision" id="collision">
                                            <option value=""></option>
                                            <option value="0">FC</option>
                                            <option value="100">100</option>
                                            <option value="250">250</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <label htmlFor="coverage">Doverage</label>
                                    </th>
                                    <td>
                                        <input type="text" id="coverage" />
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className="coverageDetails details col-span-2 col-start-3 row-start-3">
                            <h3 className='bg-slate-600 bloc-title'>Policy Status Details</h3>
                            <table>
                                <tr>
                                    <th>
                                        <label htmlFor="status">Policy Status</label>
                                    </th>
                                    <td>
                                        <input type="radio" name="status" id="status" value="Active" />
                                        <label className="statusLabel">Active</label>
                                        <br />
                                        <input type="radio" name="status" id="status" value="Paused" />
                                        <label className="termLabel">Paused</label>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="continue">
                        <button className="bg-cyan-500 submit" onClick={modifyPolicyClick}>Issue</button>

                    </div>
                </div>

            </div>
        </div>
    )
}