#!/bin/bash

if [ ! -d "/var/www/microting/eform-angular-items-group-planning-plugin" ]; then
  cd /var/www/microting
  su ubuntu -c \
  "git clone https://github.com/microting/eform-angular-items-group-planning-plugin.git -b stable"
fi

cd /var/www/microting/eform-angular-items-group-planning-plugin
su ubuntu -c \
"dotnet restore eFormAPI/Plugins/ItemsGroupPlanning.Pn/ItemsGroupPlanning.Pn.sln"

echo "################## START GITVERSION ##################"
export GITVERSION=`git describe --abbrev=0 --tags | cut -d "v" -f 2`
echo $GITVERSION
echo "################## END GITVERSION ##################"
su ubuntu -c \
"dotnet publish eFormAPI/Plugins/ItemsGroupPlanning.Pn/ItemsGroupPlanning.Pn.sln -o out /p:Version=$GITVERSION --runtime linux-x64 --configuration Release"

if [ -d "/var/www/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/items-group-planning-pn" ]; then
	su ubuntu -c \
	"rm -fR /var/www/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/items-group-planning-pn"
fi

su ubuntu -c \
"cp -av /var/www/microting/eform-angular-items-group-planning-plugin/eform-client/src/app/plugins/modules/items-group-planning-pn /var/www/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/items-group-planning-pn"
su ubuntu -c \
"mkdir -p /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/Plugins/"

if [ -d "/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/Plugins/ItemsGroupPlanning" ]; then
	su ubuntu -c \
	"rm -fR /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/Plugins/ItemsGroupPlanning"
fi

su ubuntu -c \
"cp -av /var/www/microting/eform-angular-items-group-planning-plugin/out /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/Plugins/ItemsGroupPlanning"


echo "Recompile angular"
cd /var/www/microting/eform-angular-frontend/eform-client
su ubuntu -c \
"/var/www/microting/eform-angular-items-group-planning-plugin/testinginstallpn.sh"
su ubuntu -c \
"export NODE_OPTIONS=--max_old_space_size=8192 && GENERATE_SOURCEMAP=false npm run build"
echo "Recompiling angular done"
/rabbitmqadmin declare queue name=eform-angular-items-group-planning-plugin durable=true
