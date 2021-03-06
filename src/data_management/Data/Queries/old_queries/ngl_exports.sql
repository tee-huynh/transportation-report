select [Period],
[Region],
[Product],
round([Pipeline],0) as [Pipeline], 
round([Railway],0) as [Railway],
round([Marine],0) as [Marine],
round([Truck],0) as [Truck]

from
(


SELECT 
[Period],
[Product],
[Mode],
[Region],
[Value (m3)]
FROM [EnergyData].[dbo].[NEB_CTS_ByMode_NGL]

where Mode <> 'Total'
) as tidy

pivot
(
avg([Value (m3)]) for Mode in ([Pipeline],[Railway],[Truck],[Marine])
) as non_tidy

order by [Product],[Region],[Period]