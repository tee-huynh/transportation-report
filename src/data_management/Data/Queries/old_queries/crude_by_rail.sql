select [Date],round([bbl per day],0) as [bbl per day], round([m3 per day],0) as [m3 per day]

from
(

SELECT 
[Date],
[Units],
[Volume]

FROM [EnergyData].[dbo].[NEB_RailExports_Oil] 
where Units in ('bbl per day','m3 per day')
) as tidy

pivot
(
avg(Volume) for Units in ([bbl per day],[m3 per day])
) as non_tidy