-- {nKey:1}
  -- redis-cli --ldb --eval pollDeletion.lua
--local foo=redis.call('ping')
--return foo


-- redis-cli --ldb --eval pollDeletion.lua list_a list_b , 10
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
--   redis-cli --ldb-sync-mode --eval pollDeletion.lua list_a list_b , 10




local idUser=KEYS[1]

local IdSch=redis.call('smembers', idUser)
-- local len=#IdSch

-- for i = 1,len+1,1 
-- do
--     local idSch=IdSch[i]
--     local boExist=redis.call('exists', idSch)
--     if(not boExist) then redis.call('srem', idUser, idSch) end
-- end
for k, idSch in pairs(IdSch) do
  local boExist=redis.call('exists', idSch)
  if(not boExist) then redis.call('srem', idUser, idSch) end
end
--redis.breakpoint()


--   redis-cli --ldb --eval pollDeletion.lua u123 
--   redis-cli --ldb-sync-mode --eval pollDeletion.lua u123

--   redis-cli --ldb --eval pollDeletion.lua syn:fb_12345

