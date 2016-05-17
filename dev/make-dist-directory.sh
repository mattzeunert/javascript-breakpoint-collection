cp -r extension/ dist
rm dist/build/*.map
zip -r dist.zip dist/
rm -r dist
