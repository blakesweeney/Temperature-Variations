require "rake/testtask"
require "vlad"
require "bundler/vlad"

dec "Deploy this app" => %w{
  test
  vlad:update
  vlad:start_app
  vlad:cleanup
}

Rake::TestTask.new do |t|
  t.libs << 'spec'
  t.pattern = "spec/*/*_spec.rb"
end

task :default => :test
