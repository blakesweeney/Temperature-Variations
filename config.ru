require "./site"

set :enviroment, ENV['RACK_ENV'].to_sym
set :app_file, 'site.rb'
disable :run

log = ::File.new("logs/sinatra.log", "a")
$stdout.reopen(log)
$stderr.reopen(log)

run Sinatra::Application

# vim: ft=ruby
