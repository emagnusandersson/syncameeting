  -- redis-cli --ldb --eval examples.lua
--local foo=redis.call('ping')
--return foo


-- redis-cli --ldb --eval examples.lua list_a list_b , 10
-- b 13
-- l
-- e 1+2
-- e redis.sha1hex("foo")
--   However one can not change the environment(variables?!?) (at the time of writing)
-- c

  -- On commandline
  -- redis-cli rpush list_a a b c d
  -- redis-cli rpush list_b 1 2 3 4
local src=KEYS[1]
local dst=KEYS[2]
local count=tonumber(ARGV[1])
--return true

  -- Move last element from src list to first element in dst list
  -- 1 2 3 4 5 6   ... a b c
  -- 1 2 3 4 5   ... 6 a b c
while count>0 do
    local item=redis.call('rpop',src)
    --redis.debug("value of item:",item)
    --if item==false then redis.breakpoint() end
    if item==false then break end
    redis.call('lpush',dst,item)
    count=count-1
end
return redis.call('llen',dst)

  -- inspect list_a and list_b with "redis" command  ("r") (a command available in the debugger)
--redis lrange list_a 0 -1
--redis lrange list_b 0 -1



-- maxlen
--  redis-cli -r 1000 lpush mylist a
--  r lrange mylist 0 -1  // gives a to long list to be viewed

-- Retain changes. Note running in sync mode stops the server (important to know if you are debugging in production or whatever.)
--   redis-cli --ldb-sync-mode --eval examples.lua list_a list_b , 10