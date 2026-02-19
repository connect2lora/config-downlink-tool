CMD
01  Transmit Time Interval (4b)
04  Reset (2)
08  Pull a uplink
A8  Modbus commando devcfg

[cmd][crc][datlen]

CMD: a9 = set command1
CRC: 00 = no crc / 01 add crc16
datlen: Modbus commando length

06 = modbus addr
04 = funccode read input reg
00
01 = pressure reg


