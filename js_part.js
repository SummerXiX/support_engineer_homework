const fs = require("fs");
const Papa = require("papaparse");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const organizationCsv = fs.readFileSync("./data/organization.csv", "utf8");
const accountCsv = fs.readFileSync("./data/account.csv", "utf8");

let organizations = [];
let accounts = [];

Papa.parse(organizationCsv, {
    header: true,
    complete: (result) => {
        organizations = result.data;
    },
});

Papa.parse(accountCsv, {
    header: true,
    complete: (result) => {
        accounts = result.data;
    },
});

function getOptimizationSettingsByDomain(domain) {
    const org = organizations.find((o) => o.myShopifyDomain === domain);
    const setup = org ? JSON.parse(org.setup) : null;
    return setup.optimization;
}

function listAllOrganizations() {
    return organizations
        .map((o) => {
            const relatedAccount = accounts.find(
                (a) => a.organizationId === o.id
            );
            return {
                createdDate: o.createdDate,
                status: relatedAccount ? relatedAccount.status : null,
                planName: relatedAccount ? relatedAccount.planName : null,
            };
        })
        .sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
}

function listCancelledOrganizations() {
    return organizations.filter((o) => {
        const relatedAccount = accounts.find((a) => a.organizationId === o.id);
        return relatedAccount && relatedAccount.status === "CANCELLED";
    });
}

function getOrganizationByName(orgName) {
    return organizations.find((o) => o.orgName === orgName);
}

console.log("Select an option:");
console.log("1. Fetch optimization settings by myShopifyDomain");
console.log(
    "2. List all organizations with date created, status, and planName"
);
console.log("3. List organizations with status as 'cancelled'");
console.log("4. Fetch organization by orgName in JSON format");

rl.question("Your choice: ", (choice) => {
    switch (choice) {
        case "1":
            rl.question("Enter the myShopifyDomain: ", (domain) => {
                console.log(getOptimizationSettingsByDomain(domain));
                rl.close();
            });
            break;
        case "2":
            console.log(listAllOrganizations());
            rl.close();
            break;
        case "3":
            console.log(listCancelledOrganizations());
            rl.close();
            break;
        case "4":
            rl.question("Enter the orgName: ", (orgName) => {
                const orgObject = getOrganizationByName(orgName);
                console.log(JSON.stringify(orgObject, null, 2));
                rl.close();
            });
            break;
        default:
            console.log("Invalid choice.");
            rl.close();
    }
});
