# SAP TRP to SAP Cloud Platform Business Rules Migration Tool
## How to deploy the Tool?

#### Steps:

1. Download the file ***trp_xsa_migr_tool.mtar*** from the mta_archives folder
2. Login to ***xs*** command line
    ```sh
    xs login -a https://<host>:<port>/ -u <XSA_USER> -p '<Password>' -s <xsa_space> --skip-ssl-validation
    ```
    ***Note:*** Setup the xs command line by following this link: https://developers.sap.com/tutorials/hxe-ua-install-xs-xli-client.html
3. Execute the below command from the same folder where the mtar file is downloaded
    ```sh
    xs deploy trp_xsa_migr_tool.mtar
    ```
4. Refer to SAP Note: ***3007851*** on the usage of the tool

## Limitations

1. This tool is ***NOT TO BE USED***  in ***Production System***
2. The tool supports migration of SAP HRF rules to SAP Cloud Platform Business Rules (Rel.Lang - 1.0) only
3. The tool migrates the rules as-is. In case of any migration issues, fix the issues in SAP Cloud Platform Business Rules manually

## Known Issues
None

## How to obtain support
This project is provided "as-is": there is no guarantee that raised issues will be answered or addressed in future releases.
