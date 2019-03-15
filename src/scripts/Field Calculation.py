import arcpy
import os
from arcpy import env
env.workspace = r"D:\SWFT_Data\SWFT_Data\SWFTData.gdb"

fc = r"D:\SWFT_Data\SWFT_Data\SWFTData.gdb\zeroQ_nDays_WM"

with arcpy.da.UpdateCursor(fc,["trend_1966","pvalue_LTP_1966","sym_LTP_1966"]) as cursor:
    for row in cursor:
        if row[0] < 0:
            row[2] = float(row[1] * -1)
        else:
            row[2] = row[1]
        cursor.updateRow(row)
        print "field calculation conducted"