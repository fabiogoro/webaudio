use Rack::Static,
  :urls => Dir.glob("#{root}/*").map { |fn| fn.gsub(/#{root}/, '')},
  :root => "public",
  :index => 'index.html',
  :header_rules => [[:all, {'Cache-Control' => 'public, max-age=3600'}]]

headers = {'Content-Type' => 'text/html', 'Content-Length' => '9'}
run lambda { |env| [404, headers, ['Not Found']] }
