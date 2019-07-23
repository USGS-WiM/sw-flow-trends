import arcpy
import os
from arcpy import env

env.workspace = r"D:/Projects/Data/sw-flow-trends/Low_streamflowt"
env.overwriteOutput = True

gdb_name = "test.gdb"
final_gdb_name = "sw-flow-trends.gdb"
out_path = r"D:/Projects/Data/sw-flow-trends/temp/"
out_gdb_path = out_path + gdb_name
## check for existing gdb, create if not there

print str(arcpy.Exists(out_gdb_path)) + " for test.gdb"
if arcpy.Exists(out_gdb_path) is False:
    arcpy.CreateFileGDB_management(out_path, gdb_name)
elif arcpy.Exists(out_gdb_path) is True:
    arcpy.Delete_management(out_gdb_path)
    arcpy.CreateFileGDB_management(out_path, gdb_name)

## Use Table to Table to Import csvs to gdb

in_rows = ["trends_JD.diff.Q2.csv", "trends_JD.first.Q2.csv", "trends_JD.last.Q2.csv", "trends_lowQ.1day.csv", "trends_lowQ.3day.csv", "trends_lowQ.7day.csv", "trends_mean.annual.Q.csv", "trends_Q2.nDays.csv", "trends_Q2.scaled.deficit.csv", "trends_zeroQ.nDays.csv", "trends_peak_flows.csv"]
in_tables = []

for index, item in enumerate(in_rows):
    table_name_temp = str.replace(item, ".csv", "")
    in_tables.append(str.replace(table_name_temp, ".", "_"))

    out_table = str.replace(in_tables[len(in_tables)-1], "trends_", "")
    arcpy.TableToTable_conversion(item, out_gdb_path, out_table)
    # print "table " + out_table +" added to " + gdb_name

print "all tables added to " + gdb_name


## Import gage characteristics for spatial aspect of layers
in_Table = "gage_characteristics.csv"
x_coords = "dec_long_va"
y_coords = "dec_lat_va"
out_Layer = "gage_layer"
saved_Layer = out_path + "gages.lyr"

# Set the spatial reference
spRef = arcpy.SpatialReference(4326)

# Make the XY event layer...
print "making event layer"
arcpy.MakeXYEventLayer_management(in_Table, x_coords, y_coords, out_Layer, spRef)

# Save to a layer file
arcpy.SaveToLayerFile_management(out_Layer, saved_Layer)
print "saved to layer file"

# project to WGS 84 (auxillary sphere)
outCS = arcpy.SpatialReference(102100)
outfc = 'trend_gages'
arcpy.Delete_management(outfc + ".shp")
arcpy.Project_management(out_Layer, outfc, outCS)
print "projected data"
arcpy.FeatureClassToFeatureClass_conversion(out_Layer, out_gdb_path, outfc)
print "feature class created for sites"

# Loop through feature classes to join all tables to trends_gages layer and create new feature classes
env.workspace = r"D:/Projects/Data/sw-flow-trends/temp/" + gdb_name

tables = arcpy.ListTables()
for table in tables:

    table_layer_name = table + "_layer"

    # Create a feature layer
    arcpy.MakeFeatureLayer_management(outfc,  table_layer_name)
    
    # Join the feature layer to a table
    arcpy.AddJoin_management(table_layer_name, "site_id", table, "site_id")
    
    # Copy the layer to a new permanent feature class
    arcpy.CopyFeatures_management(table_layer_name, table_layer_name + "_join")

    # print "made " + table_layer_name + "_join"

print "made joined layers"


# Copy test gdb into final trend gdb and remove all extra tables 
env.workspace = r"D:/Projects/Data/sw-flow-trends/temp/"

arcpy.Copy_management(gdb_name, final_gdb_name)

env.workspace = r"D:/Projects/Data/sw-flow-trends/temp/" + final_gdb_name

for table in tables:

    arcpy.Delete_management(table)
    #print "deleted " + table

print "deleted tables"
    

## set models and years for adding symbology fields and making calculations
fcl = arcpy.ListFeatureClasses("*")
models = ["INDE","AR1","LTP"]
years = ["1916","1941","1966"]
for fc in fcl:
    """ fields = arcpy.ListFields(fc)
    print fc + "-------------------------------------------"
    layer = fc.replace("_layer_join","")
    for field in fields:
        for model in models:
            for year in years:
                if layer + "_trend_" + year in field.name or layer + "_pvalue_" + model in field.name or "sym_" + model + "_" + year in field.name:
                    # print field.name
                    if field.type == "String":
                        print("{0} is a type of {1} with a length of {2}"
                            .format(field.name, field.type, field.length)) """
    for model in models:
        for year in years:
            if fc != "trend_gages":
                print "sym_" + model + "_" + year + " for " + fc
                arcpy.AddField_management(fc, "sym_" + model + "_" + year, "DOUBLE", "#", "#", "#", "#", "#", "#", "#")

                layer = fc.replace("_layer_join","")

                # field calculations for symbology
                
                with arcpy.da.UpdateCursor(fc, [layer + "_trend_" + year, layer + "_pvalue_" + model + "_" + year, "sym_" + model + "_" + year, "trend_gages_site_id"]) as cursor:
                    for row in cursor:
                        #if row[0].find("NA") == -1:
                        if "NA" not in str(row[0]) and "None" not in str(row[0]):
                            #print "row[0] is " + str(row[0])
                            if row[0] < 0:
                                #print "row[0] is " + str(row[0])
                                if row[1] < .000001 and row[1] > 0:
                                    row[1] = .000001
                                    row[2] = float(row[1])*-1
                                else:
                                    row[2] = float(row[1])*-1
                                    #print row[2].name
                            elif row[1] != None:
                                try:
                                    row[2] = float(row[1])
                                except:
                                    print "can't be converted"
                                    print str(row[2])
                                    print str(row[1])
                                    print str(row[3])
                                    print row[1] == None
                                    #os.system("pause")
                                    
                            cursor.updateRow(row)
                        
                    print "field calculations conducted for " + layer + ":" + model + ":" + year

    # Create layers for mxd


# env.workspace = r"D:/Projects/Data/sw-flow-trends/temp/"

for fc in fcl:
    for model in models:
        for year in years:
            if fc != "trend_gages":

                # Set layer to apply symbology to
                inputLayer = fc

                layer = fc.replace("_layer_join","")

                # Set layer that output symbology will be based on
                symbologyLayer = r"D:/Projects/Data/sw-flow-trends/temp/trends_" + model + "_" + year + ".lyr"

                # The symbology layer is symbolized by population normalized by area.
                # Symbolize the input by Pop2014 field normalized to Square Miles
                symbologyFields = [["VALUE_FIELD", "#", "sym_" + model + "_" + year]]
                
                out_Layer = layer + "_" + model + "_" + year
                saved_Layer = r"D:/Projects/Data/sw-flow-trends/temp/layers/" + layer + "_" + model + "_" + year + ".lyr"
                # Create a feature layer
                arcpy.MakeFeatureLayer_management(inputLayer, out_Layer)

                # Save to a layer file
                arcpy.SaveToLayerFile_management(out_Layer, saved_Layer)
                print "saved to layer as " + layer + "_" + model + "_" + year + ".lyr"

                # Apply the symbology from the symbology layer to the input layer
                arcpy.ApplySymbologyFromLayer_management(saved_Layer, symbologyLayer)