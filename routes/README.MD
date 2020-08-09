# Local development
Local data are in mmapv1 format, so it requires MongoDB 3.0
To run the Local MongoDB:
```
"C:\Program Files\MongoDB\Server\3.0\bin\mongod.exe" --dbpath C:\Users\rinaldi\Documents\Andrea\GitHub\hungry4zone\SampleData --storageEngine=mmapv1
```
Data can be inspected with MongoDB Compass Community, the server listens on port 27017

Running the local nodejs server by default connect throungh Mongoose at `mongodb://localhost/hungry4zone`, which is the correct local URL