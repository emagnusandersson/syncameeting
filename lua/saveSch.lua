-- {nKey:2}
  -- redis-cli --ldb --eval saveSch.lua
--local foo=redis.call('ping')
--return foo


-- redis-cli --ldb --eval saveSch.lua list_a list_b , 10
-- b 13
-- l
-- e 1+2
-- e redis.sha1hex("foo")
--   However one can not change the environment(variables?!?) (at the time of writing)
-- c



  -- inspect list_a and list_b with "redis" command  ("r") (a command available in the debugger)
--redis lrange list_a 0 -1
--redis lrange list_b 0 -1


-- maxlen
--  redis-cli -r 1000 lpush mylist a
--  r lrange mylist 0 -1  // gives a to long list to be viewed

-- Retain changes. Note running in sync mode stops the server (important to know if you are debugging in production or whatever.)
--   redis-cli --ldb-sync-mode --eval saveSch.lua list_a list_b , 10


-- local socket = require "socket"


local idUser, idSch=unpack(KEYS)
local strSch, lastActivity, tNow=unpack(ARGV)
lastActivity=tonumber(lastActivity)
tNow=tonumber(tNow)

local lastActivityL=redis.call('hget', idSch, "lastActivity")
if lastActivityL==false then lastActivityL=0 end
lastActivityL=tonumber(lastActivityL)
if lastActivityL>lastActivity then return "old" end

redis.call('hset', idSch, "strSch", strSch, "idUser", idUser, "lastActivity", lastActivity)
redis.call('hsetnx', idSch, "created", tNow)

redis.call('sadd', idUser, idSch)
redis.call('expire', idUser, 3600*24*30)
redis.call('expire', idSch, 3600*24*30)
--redis.breakpoint()

return "ok"

--   redis-cli --ldb --eval saveSch.lua u123 s123 , "abc" 123 456
--   redis-cli --ldb-sync-mode --eval saveSch.lua u123 s123 , "abc" 123 456

--   redis-cli --ldb --eval saveSch.lua syncameetingU:fb_12345 syncameetingSch:abc , "abc" 123 456

