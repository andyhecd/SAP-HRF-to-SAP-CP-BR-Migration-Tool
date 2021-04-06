# SAP TRP to SAP Cloud Platform Business Rules Migration Tool

## How to deploy the Tool?

### Steps:

To build and deploy this project, perform the following steps:

1. Open the SAP-TRP/SAP-HRF-to-SAP-CP-BR-Migration-Tool and clone the project in your local folder.

2. Navigate inside SAP-HRF-to-SAP-CP-BR-Migration-Tool folder, select all files and zip it.

3. In the SAP Web IDE, right click on Workspace and navigate to ```Import -> File or Project```.

4. Browse and provide the zip file of the project you have created in step 2.

5. Select the Extract Archive check box and choose OK.

6. Right click on the project and navigate to ``` Project -> Project Settings```.

7. Under ```Project -> Space```, select your development space and choose Save. For more information on organization and space, see the SAP HANA guide.

8. Right click on the main project. Choose ```Build -> Build```

9. To view the MTAR file generated (refer the build action logs). Under the workspace root expand the folder `mta_archives`, here we should have a newly generated MTAR file. Sample successful Build log as below:

    > **IMPORTANT**: Please do not directly deploy [`trp_xsa_migr_tool.mtar`](https://github.com/SAP-TRP/SAP-HRF-to-SAP-CP-BR-Migration-Tool/blob/main/mta_archives/trp_xsa_migr_tool.mtar)

    ```swift
    17:39:24 (Builder) Build of "/SAP-HRF-to-SAP-CP-BR-Migration-Tool-main_0.0.1" started.
    17:39:27 (DIBuild) [INFO] Target platform is XSA[INFO] Reading mta.yaml[INFO] Processing mta.yaml[INFO] Creating MTA archive[INFO] Saving MTA archive SAP-HRF-to-SAP-CP-BR-Migration-Tool-main_0.0.1_0.0.1.mtar[INFO] Done
    17:39:27 (DIBuild) ********** End of /SAP-HRF-to-SAP-CP-BR-Migration-Tool-main_0.0.1 Build Log **********
    17:39:27 (DIBuild) Build results link: https://URL:53075/che/builder/workspaceudowhn2owfxwtylt/download-all/060624d4-3984-4336-855e-d040d9c32e79?arch=zip
    17:39:27 (Builder) The .mtar file build artifact was generated under /mta_archives/SAP-HRF-to-SAP-CP-BR-Migration-Tool-main_0.0.1.
    17:39:31 (Builder) Build of /SAP-HRF-to-SAP-CP-BR-Migration-Tool-main_0.0.1 completed successfully.
    ```
    
10. Right click on the MTAR file. Select Export.

11. Once the MTAR file is exported, deploy this application to the space where you are deploying the SAP Transportation Resource Planning 4.0 application.

12. Login to ***xs*** command line

    ```sh
    xs login -a https://<host>:<port>/ -u <XSA_USER> -p '<Password>' -s <xsa_space> --skip-ssl-validation
    ```
    
    > ***Note:*** Setup the xs command line by following this link: https://developers.sap.com/tutorials/hxe-ua-install-xs-xli-client.html

13. Execute the below command from the same folder where the mtar file is downloaded
    
    ```sh
    xs deploy trp_xsa_migr_tool.mtar
    ```
    
14. Refer to SAP Note: ***3007851*** on the usage of the tool

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
