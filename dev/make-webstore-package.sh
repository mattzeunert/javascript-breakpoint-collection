cp -r extension/ webstore
rm webstore/build/*.map
zip -r webstore.zip webstore
rm -r webstore
