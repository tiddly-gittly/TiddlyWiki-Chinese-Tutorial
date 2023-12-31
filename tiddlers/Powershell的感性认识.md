## 认识PowerShell
```powershell
Get-ChildItem "*.mkv" |
ForEach-Object {  
    $source = $_.FullName  
    $destination = $_.Name -replace "\.mkv", ".mp4"  
    ffmpeg -i $source -c:v copy -c:a copy -f mp4 $destination  
}

foreach ($file in Get-ChildItem "*.mp4") { 
    Write-Output $file.FullName
    $source = $file.FullName  
    $destination = $file.Name -replace "\.mkv", ".mp4"  
    ffmpeg -i $source -c:v copy -c:a copy -f mp4 $destination  
}
```

- 管道符号`|`，PowerShell 的管道（Pipeline）功能，它允许你将一个命令的输出作为下一个命令的输入。
- `$destination` 是一个变量
- `$_.Name` 指的是当前管道对象（当前正在处理的文件或对象）的 `Name` 属性。
- 在 PowerShell 中，点（`.`）是一个特殊字符，它用作正则表达式的“任意字符”匹配。如果你想匹配实际的点字符，你需要对它进行转义。在 PowerShell 中，你可以通过在点前面加上反斜杠（`\`）来转义它。因此，`\.` 就表示匹配一个实际的点字符。
	- 在正则表达式中，没有转义的点（`.`）会匹配任何单个字符（除了换行符）。所以，如果你只是写 `*.mkv`，它会匹配任何以任意字符开头，其后紧跟 `.mkv` 的字符串。但是，如果你写的是 `*.mp4`，它只会匹配以任意字符开头，其后紧跟 `.mp4` 的字符串。
- `\.` 是用来确保只匹配文件扩展名 `.mkv` 而不是其他以 `.mkv` 结尾的字符串。这样，`-replace` 操作就会只替换文件扩展名 `.mkv` 为 `.mp4`，而不会影响文件名中的其他点字符。


```powershell
"filename.mp4" -replace "\.mp4", ".mmf"
```

- `$String -replace <regex>, <replacement>`，在ps中，`-replace` 是一个字符串方法，其中`<regex>`是要匹配的正则表达式，`<replacement>` 是要替换的字符串。

```powershell
ls "D:\Desktop\test" -i *.txt -r | foreach {
	ren $_.FullName $_.FullName.Replace("oldname", "newname")
}
```


| 命令&方法 | 参数解释 | 解释 |
| ---- | ---- | ---- |
| ls |  | 'ls' is an alias of 'Get-ChildItem'。读取路径下的所有文件信息 |
|  | -i | 为单词Include的首字母，意为包含的内容，可使用通配符，后加参数*.txt意为查找所有后缀名为txt的文件，可自由替换 |
|  | -r | 为单词递归Recurse的首字母，意为递归查找 |
| foreach |  | 'foreach' is an alias of 'ForEach-Object'.	可类比for循环语句，意为对循环的每一个元素进行操作，后加操作内容 |
| $_ |  | 用于读取每一个由foreach得到的元素，本例中返回文件的详细信息（状态、大小、路径） |
| .FullName |  | 该方法返回文件的完整路径 |
| ren |  |  'ren' is an alias of 'Rename-Item'。为单词rename的前三个字母，后加文件的原始名称及修改后的名称。 |
| .Replace	 |  | 该方法用于进行字符串的替换操作,后加参数:待替换的内容，替换后的内容 |
- `powershell`命令不区分大小写，首字母大写为提高可读性。
- 以上命令&参数为了简洁可读，均使用别名(Alias)。
- 待替换的文件名字符串 不能出现 在路径中，否则会因为路径被修改而报错，找不到文件。

```powershell
# 递归查找路径下包含*.mp4的文件。
ls "D:" -i *.mp4 -r
```

```powershell
Get-ChildItem $PSHOME |
  ForEach-Object -Process {if (!$_.PSIsContainer) {$_.Name; $_.Length / 1024; " " }}
```


## PowerShell 命令之间的结果传递

1. 变量，由以美元符号 (`$`) 开头的文本字符串表示，例如 `$a`、`$process` 或 `$my_var`。
2. 参数
3. 引用
4. 数组，$items = 10, "blue", 12.54e3, 16.30D
5. 哈希表，`@{ <name> = <value>; [<name> = <value> ] ...}`
6. 对象
7. 管道（`|`）,每个管道运算符将前一个命令的结果作为输入发送到下一个命令。
