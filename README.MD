# Local development
Local data are in mmapv1 format, so it requires MongoDB 3.0
To run the Local MongoDB:
```
"C:\Program Files\MongoDB\Server\3.0\bin\mongod.exe" --dbpath C:\Users\rinaldi\Documents\Andrea\GitHub\hungry4zone\SampleData --storageEngine=mmapv1
```
Data can be inspected with MongoDB Compass Community, with the connection string: `mongodb://localhost/hungry4zone`

Running the local nodejs server by default connect through Mongoose with the same connection string.

# MongoDB hosting
The production DB is hosted in mLab (https://mlab.com/home)
The account name is "limitless-beyond-3" and the password is "la solita"

To use MongoDB Compass utility to access hosted DB, connect with the following connection string:
```
mongodb://h4zTemplate:hXfvyP46YPRH79yuPVi54okRyKs8VWO9eivlTlGZ8xY-@ds062797.mongolab.com:62797/h4zTemplate?authSource=h4zTemplate
```
