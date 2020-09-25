# Local development

`SampleData` subfolder contains a sample data set, copy it to a working directory for use while development.

To run the Local MongoDB:
```
"C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath C:\Users\rinaldi\Documents\working\h4z\SampleData44
```
Data can be inspected with MongoDB Compass Community, with the connection string: `mongodb://localhost/hungry4zone`

Running the local nodejs server by default connect through Mongoose with the same connection string.

# Azure hosting
The app is hosted on Microsoft Azure (https://portal.azure.com/#home).

The account name is "company e-mail" and the password is "la solita, current year".

The "Deployment center" shows the latest app deployments.
In the "Configuration" area is managed the connection string.

# MongoDB hosting on Atlas 
The production DB is hosted in mongoDB Atlas (https://cloud.mongodb.com/)
The account name is "andrea_rinaldi@hotmail.it" and the password is "la solita"

To use MongoDB Compass utility to access hosted DB, connect with the following connection string:
```
mongodb+srv://h4zTemplate:hXfvyP46YPRH79yuPVi54okRyKs8VWO9eivlTlGZ8xY-@h4ztemplate.f1yfq.azure.mongodb.net/h4zTemplate?retryWrites=true&w=majority
```

# ***DEPRECATED*** MongoDB hosting on mLab 
*This refers to the old hosting of the DB on mLab, which now is on Atlas, so that these notes are now __DEPRECATED__*

The production DB is hosted in mLab (https://mlab.com/home)
The account name is "limitless-beyond-3" and the password is "la solita"

To use MongoDB Compass utility to access hosted DB, connect with the following connection string:
```
mongodb://h4zTemplate:hXfvyP46YPRH79yuPVi54okRyKs8VWO9eivlTlGZ8xY-@ds062797.mongolab.com:62797/h4zTemplate?authSource=h4zTemplate
```
# ***DEPRECATED*** Local data in mmapv1 format

*This refers to the old sample data, so that these notes are now __DEPRECATED__*

Local data are in `mmapv1` format, so it requires MongoDB 3.0.

`SampleData-3.0` subfolder contains a sample data set, copy it to a working directory for use while development.

To run the Local MongoDB:

"C:\Program Files\MongoDB\Server\3.0\bin\mongod.exe" --dbpath C:\Users\rinaldi\Documents\working\h4z\SampleData-3.0 --storageEngine=mmapv1

