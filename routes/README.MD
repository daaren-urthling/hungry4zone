# Local development
Local data are in mmapv1 format, so it requires MongoDB 3.0
To run the Local MongoDB:
```
"C:\Program Files\MongoDB\Server\3.0\bin\mongod.exe" --dbpath C:\Users\rinaldi\Documents\Andrea\GitHub\hungry4zone\SampleData --storageEngine=mmapv1
```
Data can be inspected with MongoDB Compass Community, with the connection string: `mongodb://localhost/hungry4zone`

Running the local nodejs server by default connect through Mongoose with the same connection string.