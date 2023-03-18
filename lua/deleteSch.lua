-- {nKey:2}
  -- redis-cli --ldb --eval deleteSch.lua
--local foo=redis.call('ping')
--return foo


-- redis-cli --ldb --eval deleteSch.lua list_a list_b , 10
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
--   redis-cli --ldb-sync-mode --eval deleteSch.lua list_a list_b , 10




  -- Delete idSch
local idUser=KEYS[1]
local idSch=KEYS[2]

local boIsMember=redis.call('sismember',idUser, idSch)
if boIsMember==false then return "errNotMember" end
local boDeleted=redis.call('del', idSch)
local boDeletedS=redis.call('srem', idUser, idSch)
local nRemaining=redis.call('scard', idUser)

return "ok", boDeleted, boDeletedS, nRemaining

--   redis-cli --ldb --eval deleteSch.lua u123 s123
--   redis-cli --ldb-sync-mode --eval deleteSch.lua u123 s123

--   redis-cli --ldb-sync-mode --eval deleteSch.lua syn:fb_12345 syn:abc



