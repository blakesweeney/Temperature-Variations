require "rake/testtask"
require "vlad"
require "bundler/vlad"

Vlad.load(:app => :passenger, :scm => 'git', :config => 'deploy.rb')

desc "Create needed links"
remote_task :make_links do
  current = "/Servers/variation_data/current"
  shared = "/Servers/variation_data/shared"
  cmds = [
    "mkdir #{current}/public/images 2>/dev/null",
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

desc "Deploy"
task :deploy => 'vlad:deploy'

Rake::TestTask.new do |t|
  t.libs << 'spec'
  t.pattern = "spec/*/*_spec.rb"
end

task :default => :test

desc "Copy image files to server"
task :images do
  system("scp public/images/families/* rna.bgsu.edu:/Servers/variation_data/shared/families/")
  system("scp public/images/positions/* rna.bgsu.edu:/Servers/variation_data/shared/positions/")
end
