# SAP TRP to SAP Cloud Platform Business Rules Migration Tool

## How to deploy the Tool?

### Steps:

To build and deploy this project, perform the following steps:

1. Login SAP Web IDE, right click on Workspace and navigate to ```Git -> Clone Repository```.

2. In the pop-up window, provide git repository URL: ```https://github.com/SAP-TRP/SAP-HRF-to-SAP-CP-BR-Migration-Tool.git```.

3. Right click on the imported project **SAP-HRF-to-SAP-CP-BR-Migration-Tool** and navigate to ``` Build -> Build CDS```.

4. Right click on the imported project **SAP-HRF-to-SAP-CP-BR-Migration-Tool** and navigate to ``` Build -> Build```.

5. To view the MTAR file generated (**refer the build action logs**). Under the project, expand the folder `mta_archives`, here we should have a newly generated MTAR file. Sample successful Build log as below:

    ```swift
    4:14:50 PM (DIBuild) [INFO] Creating MTA archive
    4:16:38 PM (DIBuild) [INFO] Saving MTA archive trp-migr-tool-dev_1.0.0.mtar
    4:16:42 PM (DIBuild) [INFO] Done
    4:16:42 PM (DIBuild) ********** End of /SAP-HRF-to-SAP-CP-BR-Migration-Tool Build Log **********
    4:16:42 PM (DIBuild) Build results link: https://URL/che/builder/workspacel8bad924ethwsj3t/download-all/014e961e-161d-4db2-a466-53e2f73b6ad5?arch=zip
    4:16:42 PM (Builder) The .mtar file build artifact was generated under SAP-HRF-to-SAP-CP-BR-Migration-Tool/mta_archives.
    4:16:59 PM (Builder) Build of /SAP-HRF-to-SAP-CP-BR-Migration-Tool completed successfully.
    ```
    
6. Right click on the MTAR file. Select Export.

7. Once the MTAR file is exported, deploy this application to the space where you are deploying the SAP Transportation Resource Planning 4.0 application.

8. Before deployment, configure madatory User Provided Service for the migration tool, which is named as **SAP_TRP_HRF_MIGR_PARAMS**. Refer to SAP Note: ***3007851*** for details.

9. Login to ***xs*** command line

    ```sh
    xs login -a https://<host>:<port>/ -u <XSA_USER> -p '<Password>' -s <xsa_space> --skip-ssl-validation
    ```
    
    > ***Note:*** Setup the xs command line by following this link: https://developers.sap.com/tutorials/hxe-ua-install-xs-xli-client.html

10. Execute the below command from the same folder where the mtar file is downloaded
    
    ```sh
    xs deploy trp-migr-tool-dev_1.0.0.mtar
    ```
    
11. Refer to SAP Note: ***3007851*** on the usage of the tool

___

## Limitations

1. This tool is ***NOT TO BE USED***  in ***Production System***
2. The tool supports migration of SAP HRF rules to SAP Cloud Platform Business Rules (Rel.Lang - 1.0) only
3. The tool migrates the rules as-is. In case of any migration issues, fix the issues in SAP Cloud Platform Business Rules manually

___

## Known Issues
None

___

## How to obtain support
This project is provided "as-is": there is no guarantee that raised issues will be answered or addressed in future releases.

___
