require "bundler"
Bundler.require

$db = Mongo::Connection.new.db('biology')
$families = %w{cWW tWW cWH tWH cWS tWS cHH tHH cHS tHS tSS cSS}.freeze
$base_url = (`hostname` =~ /lab/ ? 'http://rna.bgsu.edu/variation_data/' : '/')

get '/' do
  @title = 'All Variations'
  query = Plucky::Query.new($db['interactions'])
  @data = query.all(
    :family.in => $families,
    :conserved => true,
    :pdb => '2AW7')
  @data.select! do |d|
    if d['family'][1] == d['family'][2]
      d['positions'].first.to_i < d['positions'].last.to_i
    else
      true
    end
  end
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
  replace = ( $base_url =~ /http/ ? '/variation_data/' : '')
  @data = Dir["public/images/positions/#{@family}*"].map do |e|
      pos = e.match(/(\d+-\d+)/)[0]
      { :src => e.sub('public', replace), :positions => pos.split('-') }
  end

  if @family[1].downcase == @family[2].downcase
    @data.select! do |d|
      d[:positions].first.to_i < d[:positions].last.to_i
    end
  end
  @data.sort! { |a, b| a[:positions].first.to_i <=> b[:positions].first.to_i }
  haml :"family/show"
end
