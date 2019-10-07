#!/bin/bash

if [ -d "$HOME/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eform-client/src/app/plugins/modules/items-planning-pn"]; then
	rm -fR $HOME/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eform-client/src/app/plugins/modules/items-planning-pn
fi

cp -av $HOME/Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/items-planning-pn $HOME/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eform-client/src/app/plugins/modules/items-planning-pn

if [ -d "$HOME/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eFormAPI/Plugins/ItemsPlanning.Pn"]; then
	$HOME/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eFormAPI/Plugins/ItemsPlanning.Pn
fi

cp -av $HOME/Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/ItemsPlanning.Pn $HOME/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eFormAPI/Plugins/ItemsPlanning.Pn
