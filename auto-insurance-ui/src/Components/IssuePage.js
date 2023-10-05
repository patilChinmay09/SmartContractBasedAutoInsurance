import Web3 from 'web3';
import contractData from './contracts/AutoInsurance.json'
import { useState } from 'react';
import calculateCoverage from './Coverage'

export default function IssuePage() {

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

    //Generated Insured ID
    const insuredDetailsMethod = async () => {
        const fName = document.getElementById("fname").value;
        const lName = document.getElementById("lname").value;
        const dob = document.getElementById("dob").value;
        // Call the createInsured function without passing the `insuredId`
        const tx = await window.contract.methods.createInsured(fName, lName, dob).send({
            from: accountNumber,
            gas: 3000000, 
        });
        console.log(tx);

        const insured = await window.contract.methods.insuredIdCounter().call();
        console.log("Insured Id:", insured);
        return insured;
    }

    //Generate Vehicle ID
    const vehicleDetailsMethod = async () => {
        const vehicleType = document.getElementById("vtype").value;
        const vin = document.getElementById("vin").value;
        const mileage = document.getElementById("mileage").value;

        const vehTrans = await window.contract.methods.createVehicle(vehicleType, vin, mileage).send({
            from: accountNumber,
            gas: 3000000, 
        });
        console.log(vehTrans);
        const vehicleId = await window.contract.methods.vehicleIdCounter().call();
        console.log("Vehicle Id:", vehicleId);
        return vehicleId;
    }

    //Generate Driver Id
    const DriverDetailsMethod = async () => {
        const license = document.getElementById("license").value;
        const ageLicense = document.getElementById("ageLicense").value;

        const driverTrans = await window.contract.methods.createDriver(license, ageLicense).send({
            from: accountNumber,
            gas: 3000000, 
        });
        console.log(driverTrans);
        const driverId = await window.contract.methods.driverIdCounter().call();
        console.log("Vehicle Id:", driverId);
        return driverId;
    }

    


    const issuePolicy = async (insuredId, vehicleId, driverId, liability, comprehensive, collision, coverageAmt, effective, term) => {
        const policyTrans = await window.contract.methods.createPolicy(insuredId, vehicleId, driverId, liability, comprehensive, collision, coverageAmt, effective, term).send({
            from: accountNumber,
            gas: 3000000, 
        });
        console.log(policyTrans);
        const policyId = await window.contract.methods.policyNumber().call();
        console.log("Policy Id:", policyId);
        return policyId;
    }

    async function issuePolicyClick() {
        await connectMetamask();
        console.log(accountNumber);

        await connectContract();
        console.log("Connection")

        const insured = await insuredDetailsMethod();
        console.log(insured);

        const vehicleId = await vehicleDetailsMethod();
        const mileage = document.getElementById("mileage").value;

        const driverId = await DriverDetailsMethod();
        const ageLicense = document.getElementById("ageLicense").value;

        const effectiveDate = document.getElementById("effDate").value;
        const polTermRadio = document.getElementsByName("term");
        let polTerm;
        for (var i = 0; i < polTermRadio.length; i++) {
            if (polTermRadio[i].checked)
                polTerm = polTermRadio[i].value;
        }
        const liability = document.getElementById("liability").value;
        const comp = document.getElementById("comp").value;
        const collision = document.getElementById("collision").value;

        const coverage = calculateCoverage(liability, parseInt(comp), parseInt(collision), parseInt(ageLicense), parseInt(mileage), parseInt(polTerm));
        const totalCoverage = coverage.total;
        console.log("Coverage:", totalCoverage);

        const policuNum = await issuePolicy(insured, vehicleId, driverId, liability, comp, collision, totalCoverage.toString(), effectiveDate, polTerm);
        
        console.log("Policy Number: " + policuNum);
        if (policuNum !== undefined) {
            document.getElementById("result").innerHTML = `Policy Issued Successfully. Policy Number: ${policuNum}`
        }

    }


    return (
        <div className="bg-slate-900 bdy">

            <div className="bg-slate-800 cntnr-1">
                
                <div>
                    <p className="font-mono text-md result-container" id="result"></p>
                </div>
                <div className="policyForm">
                    <div className="grid grid-cols-2 grid-rows-3 gap-5">
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
                            </table>
                        </div>
                    </div>
                    <div className="continue">
                    <button className="bg-cyan-500 submit" onClick={issuePolicyClick}>Issue</button>

                    </div>
                </div>

            </div>
        </div>
    )
}