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
4. Refer to SAP Note: ***xxxxxx*** on the usage of the tool
