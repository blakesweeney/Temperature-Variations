require "bundler"
Bundler.require

Struct.new("Interaction", :positions, :sequence, :family)

$db = Mongo::Connection.new.db('biology')
$families = %w{cWW tWW cWH tWH cWS tWS cHH tHH cHS tHS tSS cSS}.freeze

get '/' do
  @title = 'All Variations'
  query = Plucky::Query.new($db['interactions'])
  @data = query.all(
    :family.in => $families,
    :pdb => '2AW7')
  haml :index
end

get '/family/?' do
  # SELECT family, COUNT(
  @families = $db['interactions'].group(
    :initial => '{}',
    :reduce => 'function(obj, agg) {
      agg
    }')
  haml :"family/index"
end
