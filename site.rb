require "bundler"
Bundler.require

$db = Mongo::Connection.new.db('biology')
$families = %w{cWW tWW cWH tWH cWS tWS cHH tHH cHS tHS tSS cSS}.freeze
$base_url = (`hostname` =~ /rna/ ? 'http://rna.bgsu.edu/variation_data' : '')

get '/' do
  @title = 'All Variations'
  query = Plucky::Query.new($db['interactions'])
  @data = query.all(
    :family.in => $families,
    :conserved => true,
    :pdb => '2AW7')
  haml :index
end

get '/family/?' do
  @families = $families
  haml :"family/index"
end

get '/family/:family' do
  if !$families.include?(params[:family])
    halt 404
  end

  @family = params[:family]
  @data = Dir["public/images/positions/#{@family}*"].map do |e|
      pos = e.match(/(\d+-\d+)/)[0]
      { :src => e.sub('public', $base_url), :positions => pos }
  end
  haml :"family/show"
end
