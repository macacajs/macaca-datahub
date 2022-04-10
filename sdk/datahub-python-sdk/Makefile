all: install
install:
	pip install sphinx
	pip install twine
	pip install pylint
	pip install coveralls
doc:
	sphinx-build -b html docsrc docs
clean:
	rm -rf dist build
build: clean
	python setup.py sdist build
	python setup.py bdist_wheel --universal
publish: build
	twine upload dist/*
lint:
	pylint macaca
test:
	tox
	tox -e coveralls
