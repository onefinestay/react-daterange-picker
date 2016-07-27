RE_EXPORT_FILE=src/main.js

build: $(RE_EXPORT_FILE)

test:
	@echo 0

$(RE_EXPORT_FILE):
	find src -type f -iname '*.js' | sort | perl -p -e 's/src\/(.+)\.js/export \1 from "\1";/g' > $(RE_EXPORT_FILE)

clean:
	rm -f $(RE_EXPORT_FILE) \
	rm *.tgz

release:
	./scripts/release.sh

test:
	echo 0

.PHONY: clean
