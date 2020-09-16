#!/bin/bash

cd ~

rm -fR Documents/workspace/microting/eform-angular-items-group-planning-plugin/eform-client/src/app/plugins/modules/items-group-planning-pn

cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/items-group-planning-pn Documents/workspace/microting/eform-angular-items-group-planning-plugin/eform-client/src/app/plugins/modules/items-group-planning-pn

rm -fR Documents/workspace/microting/eform-angular-items-group-planning-plugin/eFormAPI/Plugins/ItemsGroupPlanning.Pn

cp -a Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/ItemsGroupPlanning.Pn Documents/workspace/microting/eform-angular-items-group-planning-plugin/eFormAPI/Plugins/ItemsGroupPlanning.Pn

# Test files rm
rm -fR Documents/workspace/microting/eform-angular-items-group-planning-plugin/eform-client/e2e/Tests/items-group-planning-settings/
rm -fR Documents/workspace/microting/eform-angular-items-group-planning-plugin/eform-client/e2e/Tests/items-group-planning-general/
rm -fR Documents/workspace/microting/eform-angular-items-group-planning-plugin/eform-client/e2e/Page\ objects/ItemsGroupPlanning/
rm -fR Documents/workspace/microting/eform-angular-items-group-planning-plugin/eform-client/wdio-headless-plugin-step2.conf.js

# Test files cp
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Tests/items-group-planning-settings Documents/workspace/microting/eform-angular-items-group-planning-plugin/eform-client/e2e/Tests/items-group-planning-settings
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Tests/items-group-planning-general Documents/workspace/microting/eform-angular-items-group-planning-plugin/eform-client/e2e/Tests/items-group-planning-general
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Page\ objects/ItemsGroupPlanning Documents/workspace/microting/eform-angular-items-group-planning-plugin/eform-client/e2e/Page\ objects/ItemsGroupPlanning
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/wdio-plugin-step2.conf.js Documents/workspace/microting/eform-angular-items-group-planning-plugin/eform-client/wdio-headless-plugin-step2.conf.js
