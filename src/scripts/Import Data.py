import arcpy
import os
from arcpy import env
env.workspace = r"D:\SWFT_Data\SWFT_Data\ScienceBase_Data\Low_streamflowt"

## Use Table to Table to Import csvs to gdb

in_rows = ["trends_JD_diff_Q2.csv", "trends_JD_first_Q2.csv", "trends_JD_last_Q2.csv", "trends_lowQ_1day.csv", "trends_lowQ_3day.csv", "trends_lowQ_7day.csv", "trends_mean_annualQ.csv", "trends_Q2_nDays.csv", "trends_Q2_scaled_deficit.csv", "trends_zeroQ_nDays.csv"]
out_path = r"D:\SWFT_Data\SWFT_Data\Test.gdb"
out_name = ["JD_Diff_Q2", "JD_First_Q2", "JD_Last_Q2", "JD_lowQ_1day", "JD_lowQ_3day", "JD_lowQ_7day", "JD_Mean_AnnualQ", "JD_Q2_nDays", "JD_Q2_scaled_deficit", "JD_zeroQ_nDays"]

for I in in_rows:
    for O in out_name:
        arcpy.TableToTable_conversion(I,out_path,O)
        print "tables added to test gdb"