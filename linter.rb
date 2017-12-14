#!/data/data/com.termux/files/usr/bin/env ruby
require('pp')
require('open3')

prev_res = ''
while TRUE
  files_src = Dir.glob('src/*.js');
  files_test = Dir.glob('test/*.js');
  files = [files_src, files_test].flatten()
  res = ""
  files.each { |f|
      res = res + '|' + f + '=' + File.mtime(f).to_s()
  }
  if res != prev_res then
    pp res
    prev_res = res
    stdout, stderr, rc = Open3.capture3('npm run eslint-fix')
    if rc != 0 then
        pp "ESLINT-FIX failed.\nStatus: #{rc}\nSTDOUT: #{stdout}\nSTDERR: #{stderr}"
    else
        dt = Time.new()
        pp "#{dt.inspect()}: Clean"
    end
  end
  sleep(0.5)
end
