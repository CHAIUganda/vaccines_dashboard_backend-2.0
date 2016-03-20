from ubuntu:14.04

maintainer Malisa Ncube "mnncube@clintonhealthaccess.org"

run apt-get update
run apt-get install -y software-properties-common build-essential git python python-dev python-setuptools nginx supervisor mysql-client libmysqlclient-dev wget libfontenc1 libxrender1 libxrender-dev fontconfig libxfont1 xfonts-75dpi xfonts-base xfonts-encodings xfonts-utils
run easy_install pip
run wget http://download.gna.org/wkhtmltopdf/0.12/0.12.2.1/wkhtmltox-0.12.2.1_linux-trusty-amd64.deb
run dpkg -i wkhtmltox-0.12.2.1_linux-trusty-amd64.deb

# install uwsgi now because it takes a little while
run pip install uwsgi

# install nginx
run apt-get install -y python-software-properties
run add-apt-repository -y ppa:nginx/stable
run apt-get install -y sqlite3

# add celery user
run groupadd -r celery && useradd -r -g celery celery

add requirements /home/docker/code/requirements/

# run pip install
run pip install -r /home/docker/code/requirements/prod.txt

env DATABASE_URL mysql://root:ha9zqx@mysql:3306/dashboard

# install our code
add . /home/docker/code/

# create log file
run touch /tmp/django-errors.log && chmod go+w /tmp/django-errors.log

# setup all the configfiles
run echo "daemon off;" >> /etc/nginx/nginx.conf
run rm /etc/nginx/sites-enabled/default
run ln -s /home/docker/code/nginx-app.conf /etc/nginx/sites-enabled/
run ln -s /home/docker/code/supervisor-app.conf /etc/supervisor/conf.d/

# run collectstatic
run python /home/docker/code/dashboard/manage.py collectstatic --noinput --settings=dashboard.settings.prod

expose 8000
cmd ["supervisord", "-n"]
