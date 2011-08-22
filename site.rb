require "bundler"
Bundler.require

get '/' do
  haml :index
end

get '/:family' do
  haml :family
end

get '/:family/:first-:second' do
  haml :positions
end
