def func(arr, coms):
    def com1(b, c):
        arr[b] = c
    def com2(b, c):
        if not memo[b][c]:
            memo[b][c] = sum(arr[b:c+1])
        print(memo[b][c])

    for com in coms:
        if com[0] == 1:
            com1(com[1], com[2])
        if com[0] == 2:
            com2(com[1], com[2])

n,m,k = map(int, input().split())
memo = [[0 for j in range(n+1)] for i in range(n+1)]
memo_history = {i:{j:0 for j in range(n+1)} for i in range(n+1)}
arr = [0 for i in range(n+1)]
coms = [None for i in range(m+k)]
for i in range(1,n+1):
    arr[i] = int(input())

for i in range(m+k):
    coms[i] = list(map(int, input().split()))

func(arr,coms)

    