# WARNING:
# - THE STAND POINTS OF THE RELATIVE PATHS HERE ARE WHERE THE IMPORTING MAKEFILES ARE LOCATED.
# - IF YOU WANT TO OVERRIDE THE DEFAULT TARGET IN THIS FILE,
#   YOU CAN REMOVE THE POSTFIX `-default` IN THE IMPORTING MAKEFILE.
#   EX: TARGET `chek-dep` WILL OVERRIDE `chek-dep-default`


# Turn off the warning message when other makefiles including this one with overriding targets 
# https://stackoverflow.com/a/49804748/5814542
%: %-default
	@ true

BIN_DIR ?= node_modules/.bin
ROOT_DIR ?= $(abspath ../..)
CURRENT_DIRNAME := $(notdir $(CURDIR))
ROOT_BIN_DIR ?= $(ROOT_DIR)/node_modules/.bin
P := "\\033[32m[+]\\033[0m"
PACKAGE_NAME := $(shell node -pe "require('$(CURDIR)/package.json').name")

check-dep-default:
	@echo "$(P) Check dependencies of the project"
	yarn install

print-package-info-default:
	@echo "\\033[32m$(PACKAGE_NAME)\\033[0m"

dev-default: print-package-info
	@echo "$(P) Start babel watch mode"
	NODE_ENV=development $(ROOT_BIN_DIR)/babel src --out-dir lib --watch --source-maps --root-mode upward

build-default: print-package-info
	@echo "$(P) Babel transpile es6 and above to es5 at $(CURRENT_DIRNAME)/lib/"
	NODE_ENV=production $(ROOT_BIN_DIR)/babel src --out-dir lib --copy-files --root-mode upward

# This will only prettier files under this package
prettier-default:
	@echo "$(P) Run prettier"
	$(ROOT_BIN_DIR)/prettier --write --ignore-path "$(ROOT_DIR)/.eslintignore" "**/*.{js,json,css,md,html,htm}"

# This will only lint files under this package
lint-default:
	@echo "$(P) Run eslint"
	$(ROOT_BIN_DIR)/eslint -c "$(ROOT_DIR)/.eslintrc" --ignore-path "$(ROOT_DIR)/.eslintignore" --fix "**/*.js"
