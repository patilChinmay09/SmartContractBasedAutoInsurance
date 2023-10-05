# Smart Contract Based Auto Insurance

## Introduction
The "Smart Contract Based Auto Insurance" system is  designed to simplify the issuance, modification, and retrieval of auto insurance policies. By harnessing the power of blockchain technology and Ethereum smart contracts, this platform offers a streamlined and transparent approach to managing auto insurance.


## Features
The "Insurance" contract includes the following features:

1. **Policy Management**: Allows users to create and manage auto insurance policies, including details about insured individuals, vehicles, and drivers.

2. **Data Structures**: Utilizes several struct data types to organize information, such as Insured, Vehicle, Driver, Coverage, and Policy.

3. **Policy Modification**: Allows for the modification of existing policies, including changes to insured individual information, vehicle details, coverage, and policy terms.

4. **Policy Lookup**: Provides functions to retrieve policy, insured individual, vehicle, and driver details based on unique identifiers.

## Prerequisites
Before deploying and interacting with the "Insurance" contract, make sure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/)
- [Truffle](https://www.trufflesuite.com/truffle)
- [Ganache](https://www.trufflesuite.com/ganache)
- [React](https://reactjs.org/)

## Deployment

1. **Navigate to the Contract Folder**
   In the project directory, navigate to the Contract folder:

   ```bash
   cd truffleContract/my_truffle_project
   ```
2. **Compile the Contract**:

   Use the Truffle framework to compile the smart contract by running the following command in the project directory:

   ```bash
   truffle compile
   ```

3. **Configure Ganache**:

   Launch Ganache and ensure it is running with a local Ethereum blockchain.

4. **Migrate the Contract**:

   Deploy the smart contract to the local blockchain using Truffle:

   ```bash
   truffle migrate --network development
   ```

   This will deploy the contract to your local Ganache instance.

5. **Start the Front-end Application**:

   In the project directory, navigate to the React front-end application and start it:

   ```bash
   cd auto-insurance-ui
   npm start
   ```

   This will start the React application, allowing you to interact with the contract through the user interface.

## Usage

Once the contract is deployed and the front-end application is running, you can use the interface to interact with the contract. Here are some common actions:

- **Create Policies**: Generate auto insurance policies by associating insured individuals, vehicles, and drivers. Specify coverage details, effective dates, and policy terms.

- **Modify Policies**: Update existing policies by providing a JSON-like string that contains fields to be modified (e.g., change the insured's first name or update the vehicle type).

- **Lookup Policies**: Retrieve policy details, including insured individual, vehicle, and driver information, based on the policy number.

## Additional Information
- The contract utilizes a string-to-uint conversion function to handle numeric input for coverage amounts.

- The contract also includes utility functions for string manipulation, such as splitting strings based on delimiters.

- Make sure you have a configured Metamask wallet or a similar Ethereum wallet to interact with the contract on the front-end.

## License
This project is licensed under the [GNU General Public License v3.0](LICENSE).

## Author
- Chinmay Patil
- patilchinmay922@gmail.com
