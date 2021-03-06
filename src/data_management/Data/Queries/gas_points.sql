SELECT 
point.[Key Point],
point.[Corporate Entity],
point.[Pipeline Name],
[Latitude],
[Longitude],
direction.[Direction of Flow]
FROM [EnergyData].[dbo].[Pipelines_KeyPoints] as point
join
(
SELECT 
[Corporate Entity],
[Pipeline Name],
[Key Point],
[Direction of Flow]
FROM [EnergyData].[dbo].[Pipelines_Gas]
group by
[Corporate Entity],
[Pipeline Name],
[Key Point],
[Direction of Flow]
) as direction
on point.[Key Point] = direction.[Key Point] and point.[Corporate Entity] = direction.[Corporate Entity] 