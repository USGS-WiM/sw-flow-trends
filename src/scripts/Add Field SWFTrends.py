import arcpy
import os
from arcpy import env
env.workspace = r"D:\SWFT_Data\SWFT_Data\SWFTData.gdb"

## set local variables
fcl = arcpy.ListFeatureClasses("*")
for fc in fcl:
    arcpy.AddField_management(fc,"sym_INDE_1916", "DOUBLE", "#", "#", "#", "#", "#", "#", "#")
    arcpy.AddField_management(fc, "sym_AR1_1916", "DOUBLE", "#", "#", "#", "#", "#", "#", "#")
    arcpy.AddField_management(fc,"sym_LTP_1916","DOUBLE", "#", "#", "#", "#", "#", "#", "#")
    arcpy.AddField_management(fc,"sym_INDE_1941", "DOUBLE", "#", "#", "#", "#", "#", "#", "#")
    arcpy.AddField_management(fc,"sym_AR1_1941","DOUBLE","#", "#", "#", "#", "#", "#", "#")
    arcpy.AddField_management(fc, "sym_LTP_1941","DOUBLE","#", "#", "#", "#", "#", "#", "#")
    arcpy.AddField_management(fc,"sym_INDE_1966", "DOUBLE", "#", "#", "#", "#", "#", "#", "#")
    arcpy.AddField_management(fc,"sym_AR1_1966","DOUBLE", "#", "#", "#", "#", "#", "#", "#")
    arcpy.AddField_management(fc,"sym_LTP_1966", "DOUBLE", "#", "#", "#", "#", "#", "#", "#")
    show = "Field added " + fc
    print (show)