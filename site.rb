require "bundler"
Bundler.require

$db = Mongo::Connection.new.db('biology')
$families = %w{cWW tWW cWH tWH cWS tWS cHH tHH cHS tHS} << /css/i << /tss/i
$base_url = (`hostname` =~ /lab/ ? 'http://rna.bgsu.edu/variation_data/' : '/')

def first_apperance?(interaction, key = 'positions')
  interaction[key][0].to_i < interaction[key][1].to_i
end

def symmetric?(interaction)
  interaction['family'][1].downcase == interaction['family'][2].downcase
end

get '/' do
  @title = 'All Variations'
  query = Plucky::Query.new($db['interactions'])
  @data = query.all(pdb: '2AW7', :family.in => $families, conserved: true)
  @data.select! { |d| (symmetric?(d) && first_apperance?(d)) || !symmetric?(d) }
  haml :index
end

get '/family/:family' do
  halt 404 if !$families.any? { |f| f.match(params[:family]) }

  @family = params[:family].upcase
  @family[0] = @family[0].downcase
  @title = @family
  replace = ($base_url =~ /http/ ? '/variation_data/' : '')
  @data = Dir["public/images/positions/#{@family}*"].map do |e|
      matches = e.match(/(\d+)-(\d+)/)
    { :src => e.sub('public', replace), :positions => matches.captures }
  end

  if symmetric?({ 'family' => @family })
    @data.select! { |d| first_apperance?(d, :positions) }
  end
  @data.sort_by! { |d| d[:positions].first.to_i }
  haml :"family/show"
end
