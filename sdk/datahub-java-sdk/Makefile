all: doc

doc:
	javadoc -d ./docs -version -sourcepath ./src/main/java macaca.datahub
deploy:
	mvn -s settings.xml deploy -Dmaven.test.skip=true
.PHONY: doc
