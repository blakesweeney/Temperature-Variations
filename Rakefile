require "rake/testtask"
require "vlad"
require "bundler/vlad"

Vlad.load(:app => :passenger, :scm => 'git', :config => 'deploy.rb')

desc "Create needed links"
remote_task :make_links do
  current = "/Servers/variation_data/current"
  shared = "/Servers/variation_data/shared"
  cmds = [
    'rm -rf settings 2>/dev/null', 
    "ln -s #{shared}/families #{current}/public/images/families",
    "ln -s #{shared}/positions #{current}/public/images/positions"
  ]
  run cmds.join(' && ')
end

desc "Deploy this app" 
task "vlad:deploy" => %w{
  test
  vlad:update
  make_links
  vlad:start_app
  vlad:cleanup
}

Rake::TestTask.new do |t|
  t.libs << 'spec'
  t.pattern = "spec/*/*_spec.rb"
end

task :default => :test
