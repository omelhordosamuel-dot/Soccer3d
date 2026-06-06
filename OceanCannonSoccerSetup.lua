-- Run this script from Roblox Studio Command Bar or a temporary Script to rebuild the place.
-- It clears the current prototype and creates Ocean Cannon Soccer: boats, cannonball, ocean arena, and goals.

local CLEAR_CURRENT_GAME = true

local thisScript = if typeof(script) == "Instance" then script else nil

local Workspace = game:GetService("Workspace")
local ServerScriptService = game:GetService("ServerScriptService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local StarterPlayer = game:GetService("StarterPlayer")
local Lighting = game:GetService("Lighting")
local Terrain = Workspace.Terrain

local function destroyChildren(container, keepNames, keepInstances)
	keepNames = keepNames or {}
	keepInstances = keepInstances or {}
	for _, child in ipairs(container:GetChildren()) do
		if not keepNames[child.Name] and not keepInstances[child] then
			child:Destroy()
		end
	end
end

if CLEAR_CURRENT_GAME then
	destroyChildren(Workspace, {
		Terrain = true,
		Camera = true,
	})
	destroyChildren(ServerScriptService, nil, thisScript and { [thisScript] = true } or nil)
	destroyChildren(ReplicatedStorage)
	destroyChildren(StarterPlayer.StarterPlayerScripts)
	destroyChildren(StarterPlayer.StarterCharacterScripts)
	Terrain:Clear()
end

local root = Instance.new("Folder")
root.Name = "OceanCannonSoccer"
root.Parent = Workspace

local mapFolder = Instance.new("Folder")
mapFolder.Name = "Map"
mapFolder.Parent = root

local boatsFolder = Instance.new("Folder")
boatsFolder.Name = "Boats"
boatsFolder.Parent = root

local goalsFolder = Instance.new("Folder")
goalsFolder.Name = "GoalShips"
goalsFolder.Parent = root

local gameFolder = Instance.new("Folder")
gameFolder.Name = "OceanCannonSoccer"
gameFolder.Parent = ReplicatedStorage

local remotesFolder = Instance.new("Folder")
remotesFolder.Name = "Remotes"
remotesFolder.Parent = gameFolder

local controlRemote = Instance.new("RemoteEvent")
controlRemote.Name = "BoatControl"
controlRemote.Parent = remotesFolder

local function part(name, parent, cframe, size, color, material, anchored, shape)
	local p = Instance.new("Part")
	p.Name = name
	p.Anchored = anchored == nil and true or anchored
	p.CanCollide = true
	p.CFrame = cframe
	p.Size = size
	p.Color = color
	p.Material = material or Enum.Material.SmoothPlastic
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	if shape then
		p.Shape = shape
	end
	p.Parent = parent
	return p
end

local function wedge(name, parent, cframe, size, color, material)
	local p = Instance.new("WedgePart")
	p.Name = name
	p.Anchored = true
	p.CanCollide = true
	p.CFrame = cframe
	p.Size = size
	p.Color = color
	p.Material = material or Enum.Material.SmoothPlastic
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	p.Parent = parent
	return p
end

local function neonPart(name, parent, cframe, size, color)
	local p = part(name, parent, cframe, size, color, Enum.Material.Neon, true)
	p.CanCollide = false
	return p
end

local function createBuoy(name, position, color)
	local buoy = Instance.new("Model")
	buoy.Name = name
	buoy.Parent = mapFolder

	local base = part("Float", buoy, CFrame.new(position), Vector3.new(2.2, 2.2, 2.2), color, Enum.Material.Plastic, true, Enum.PartType.Ball)
	local stripe = part("WhiteBand", buoy, CFrame.new(position + Vector3.new(0, 0.05, 0)), Vector3.new(2.28, 0.28, 2.28), Color3.fromRGB(240, 240, 230), Enum.Material.SmoothPlastic, true, Enum.PartType.Ball)
	stripe.CanCollide = false
	local post = part("FlagPost", buoy, CFrame.new(position + Vector3.new(0, 2, 0)), Vector3.new(0.2, 3, 0.2), Color3.fromRGB(40, 35, 30), Enum.Material.Wood, true)
	local flag = part("Flag", buoy, CFrame.new(position + Vector3.new(0.8, 3.25, 0)), Vector3.new(1.4, 0.75, 0.08), color, Enum.Material.Neon, true)
	flag.CanCollide = false
	buoy.PrimaryPart = base
	return buoy
end

local function createGoalShip(name, z, teamColor)
	local ship = Instance.new("Model")
	ship.Name = name
	ship.Parent = goalsFolder

	local sign = z > 0 and 1 or -1
	local hullColor = Color3.fromRGB(78, 48, 32)
	local deckColor = Color3.fromRGB(139, 95, 58)
	local railColor = Color3.fromRGB(45, 31, 24)

	local hull = part("GoalTriggerHull", ship, CFrame.new(0, 3.5, z), Vector3.new(52, 7, 16), hullColor, Enum.Material.WoodPlanks, true)
	hull:SetAttribute("GoalTeam", name)
	hull:SetAttribute("IsGoalTrigger", true)
	hull.CanCollide = false
	hull.Transparency = 0.15

	part("Deck", ship, CFrame.new(0, 7.2, z), Vector3.new(58, 1.2, 19), deckColor, Enum.Material.WoodPlanks, true)
	part("Bow", ship, CFrame.new(0, 5.1, z - sign * 10.5) * CFrame.Angles(0, math.rad(180), 0), Vector3.new(58, 7, 5), hullColor, Enum.Material.WoodPlanks, true)
	part("Stern", ship, CFrame.new(0, 5.1, z + sign * 10.5), Vector3.new(58, 7, 5), hullColor, Enum.Material.WoodPlanks, true)

	part("LeftRail", ship, CFrame.new(-29, 9.1, z), Vector3.new(1, 4, 21), railColor, Enum.Material.Wood, true)
	part("RightRail", ship, CFrame.new(29, 9.1, z), Vector3.new(1, 4, 21), railColor, Enum.Material.Wood, true)
	part("BackRail", ship, CFrame.new(0, 9.1, z + sign * 11), Vector3.new(58, 4, 1), railColor, Enum.Material.Wood, true)

	local mouth = part("GoalMouth", ship, CFrame.new(0, 7.1, z - sign * 11.5), Vector3.new(42, 10, 2), teamColor, Enum.Material.ForceField, true)
	mouth.Transparency = 0.45
	mouth.CanCollide = false
	mouth:SetAttribute("ScoreGoalFor", z > 0 and "Blue" or "Red")

	part("LeftMast", ship, CFrame.new(-14, 18, z), Vector3.new(1.3, 25, 1.3), Color3.fromRGB(81, 54, 31), Enum.Material.Wood, true)
	part("RightMast", ship, CFrame.new(14, 18, z), Vector3.new(1.3, 25, 1.3), Color3.fromRGB(81, 54, 31), Enum.Material.Wood, true)
	part("LeftSail", ship, CFrame.new(-14, 20, z - sign * 0.3), Vector3.new(15, 13, 0.45), Color3.fromRGB(238, 229, 200), Enum.Material.Fabric, true)
	part("RightSail", ship, CFrame.new(14, 20, z - sign * 0.3), Vector3.new(15, 13, 0.45), Color3.fromRGB(238, 229, 200), Enum.Material.Fabric, true)
	neonPart("TeamLanternLeft", ship, CFrame.new(-24, 11.8, z - sign * 9), Vector3.new(2, 2, 2), teamColor)
	neonPart("TeamLanternRight", ship, CFrame.new(24, 11.8, z - sign * 9), Vector3.new(2, 2, 2), teamColor)

	ship.PrimaryPart = hull
	return ship
end

local function createBoat(name, position, color, teamName)
	local boat = Instance.new("Model")
	boat.Name = name
	boat.Parent = boatsFolder
	boat:SetAttribute("Team", teamName)
	boat:SetAttribute("MaxSpeed", 70)
	boat:SetAttribute("TurnSpeed", 2.6)
	boat:SetAttribute("BoostForce", 105)

	local hull = part("Hull", boat, CFrame.new(position), Vector3.new(12, 3.2, 18), Color3.fromRGB(73, 46, 30), Enum.Material.WoodPlanks, false)
	hull.CustomPhysicalProperties = PhysicalProperties.new(0.75, 0.35, 0.2, 1, 1)
	hull:SetAttribute("BoatRoot", true)

	local bow = wedge("Bow", boat, CFrame.new(position + Vector3.new(0, 0.25, -10.3)) * CFrame.Angles(0, math.rad(180), 0), Vector3.new(12, 3.4, 4.8), Color3.fromRGB(73, 46, 30), Enum.Material.WoodPlanks)
	bow.Anchored = false
	local stern = part("SternBlock", boat, CFrame.new(position + Vector3.new(0, 0.15, 9.5)), Vector3.new(12, 3, 3.5), Color3.fromRGB(73, 46, 30), Enum.Material.WoodPlanks, false)
	local deck = part("Deck", boat, CFrame.new(position + Vector3.new(0, 2.2, 0.5)), Vector3.new(10.5, 1, 15.5), Color3.fromRGB(151, 98, 56), Enum.Material.WoodPlanks, false)
	local cabin = part("Cabin", boat, CFrame.new(position + Vector3.new(0, 4, 3.8)), Vector3.new(6.5, 4, 5.5), color, Enum.Material.SmoothPlastic, false)
	local windshield = part("Windshield", boat, CFrame.new(position + Vector3.new(0, 5.2, 0.9)), Vector3.new(6, 1.5, 0.4), Color3.fromRGB(72, 155, 190), Enum.Material.Glass, false)
	windshield.Transparency = 0.35
	local ram = part("CannonballRam", boat, CFrame.new(position + Vector3.new(0, 2.3, -12.8)), Vector3.new(7.5, 2.5, 1.8), Color3.fromRGB(30, 30, 32), Enum.Material.Metal, false)
	ram:SetAttribute("HitStrength", 1.5)
	local leftPontoon = part("LeftPontoon", boat, CFrame.new(position + Vector3.new(-7.7, -0.45, 1)), Vector3.new(2.2, 2.2, 16), color, Enum.Material.SmoothPlastic, false)
	local rightPontoon = part("RightPontoon", boat, CFrame.new(position + Vector3.new(7.7, -0.45, 1)), Vector3.new(2.2, 2.2, 16), color, Enum.Material.SmoothPlastic, false)
	part("Mast", boat, CFrame.new(position + Vector3.new(0, 8, 2.2)), Vector3.new(0.7, 10, 0.7), Color3.fromRGB(66, 43, 24), Enum.Material.Wood, false)
	part("TeamFlag", boat, CFrame.new(position + Vector3.new(2.4, 10.4, 2.2)), Vector3.new(4.2, 2, 0.3), color, Enum.Material.Fabric, false)

	local seat = Instance.new("VehicleSeat")
	seat.Name = "CaptainSeat"
	seat.Anchored = false
	seat.CanCollide = false
	seat.CFrame = CFrame.new(position + Vector3.new(0, 4.45, 5.2))
	seat.Size = Vector3.new(3, 1, 3)
	seat.Color = Color3.fromRGB(25, 25, 25)
	seat.Material = Enum.Material.SmoothPlastic
	seat.Parent = boat

	local thrust = Instance.new("Attachment")
	thrust.Name = "ThrustAttachment"
	thrust.Position = Vector3.new(0, 0, 5)
	thrust.Parent = hull

	local vectorForce = Instance.new("VectorForce")
	vectorForce.Name = "BoatThrust"
	vectorForce.Attachment0 = thrust
	vectorForce.RelativeTo = Enum.ActuatorRelativeTo.World
	vectorForce.Force = Vector3.zero
	vectorForce.Parent = hull

	local align = Instance.new("AlignOrientation")
	align.Name = "Stabilizer"
	align.Mode = Enum.OrientationAlignmentMode.OneAttachment
	align.Attachment0 = thrust
	align.RigidityEnabled = false
	align.Responsiveness = 12
	align.MaxTorque = 85000
	align.Parent = hull

	local angular = Instance.new("AngularVelocity")
	angular.Name = "RudderTurn"
	angular.Attachment0 = thrust
	angular.RelativeTo = Enum.ActuatorRelativeTo.World
	angular.MaxTorque = 75000
	angular.AngularVelocity = Vector3.zero
	angular.Parent = hull

	for _, item in ipairs(boat:GetDescendants()) do
		if item:IsA("BasePart") and item ~= hull then
			local weld = Instance.new("WeldConstraint")
			weld.Part0 = hull
			weld.Part1 = item
			weld.Parent = item
			item.Massless = true
		end
	end

	boat.PrimaryPart = hull
	return boat
end

Terrain.WaterColor = Color3.fromRGB(15, 96, 132)
Terrain.WaterReflectance = 0.18
Terrain.WaterTransparency = 0.18
Terrain.WaterWaveSize = 0.55
Terrain.WaterWaveSpeed = 13
Terrain:FillBlock(CFrame.new(0, -7, 0), Vector3.new(900, 16, 900), Enum.Material.Water)
Terrain:FillBlock(CFrame.new(0, -16, 0), Vector3.new(900, 8, 900), Enum.Material.Sand)

part("ArenaBoundaryNorth", mapFolder, CFrame.new(0, 2.3, 122), Vector3.new(145, 4, 4), Color3.fromRGB(221, 197, 120), Enum.Material.Wood, true)
part("ArenaBoundarySouth", mapFolder, CFrame.new(0, 2.3, -122), Vector3.new(145, 4, 4), Color3.fromRGB(221, 197, 120), Enum.Material.Wood, true)
part("ArenaBoundaryWest", mapFolder, CFrame.new(-72, 2.3, 0), Vector3.new(4, 4, 245), Color3.fromRGB(221, 197, 120), Enum.Material.Wood, true)
part("ArenaBoundaryEast", mapFolder, CFrame.new(72, 2.3, 0), Vector3.new(4, 4, 245), Color3.fromRGB(221, 197, 120), Enum.Material.Wood, true)
part("CenterLine", mapFolder, CFrame.new(0, 0.6, 0), Vector3.new(138, 0.35, 1.2), Color3.fromRGB(235, 238, 210), Enum.Material.Neon, true).CanCollide = false
part("CenterCircle", mapFolder, CFrame.new(0, 0.75, 0), Vector3.new(30, 0.35, 30), Color3.fromRGB(235, 238, 210), Enum.Material.ForceField, true, Enum.PartType.Ball).CanCollide = false

for x = -60, 60, 30 do
	createBuoy("NorthBuoy_" .. x, Vector3.new(x, 1.5, 120), Color3.fromRGB(238, 190, 54))
	createBuoy("SouthBuoy_" .. x, Vector3.new(x, 1.5, -120), Color3.fromRGB(238, 190, 54))
end
for z = -90, 90, 30 do
	createBuoy("WestBuoy_" .. z, Vector3.new(-70, 1.5, z), Color3.fromRGB(238, 190, 54))
	createBuoy("EastBuoy_" .. z, Vector3.new(70, 1.5, z), Color3.fromRGB(238, 190, 54))
end

createGoalShip("RedGoalShip", 142, Color3.fromRGB(235, 67, 67))
createGoalShip("BlueGoalShip", -142, Color3.fromRGB(52, 126, 235))

local cannonball = part("Cannonball", root, CFrame.new(0, 6, 0), Vector3.new(8, 8, 8), Color3.fromRGB(24, 24, 26), Enum.Material.Metal, false, Enum.PartType.Ball)
cannonball.CustomPhysicalProperties = PhysicalProperties.new(0.7, 0.22, 0.72, 1, 1)
cannonball:SetAttribute("IsCannonball", true)
cannonball:SetAttribute("SpawnPosition", Vector3.new(0, 6, 0))
local ballFloatAttachment = Instance.new("Attachment")
ballFloatAttachment.Name = "FloatAttachment"
ballFloatAttachment.Parent = cannonball
local ballFloat = Instance.new("VectorForce")
ballFloat.Name = "CannonballBuoyancy"
ballFloat.Attachment0 = ballFloatAttachment
ballFloat.RelativeTo = Enum.ActuatorRelativeTo.World
ballFloat.Force = Vector3.zero
ballFloat.Parent = cannonball

createBoat("BlueBoat_1", Vector3.new(-22, 5, -55), Color3.fromRGB(52, 126, 235), "Blue")
createBoat("BlueBoat_2", Vector3.new(22, 5, -55), Color3.fromRGB(52, 126, 235), "Blue")
createBoat("RedBoat_1", Vector3.new(-22, 5, 55), Color3.fromRGB(235, 67, 67), "Red")
createBoat("RedBoat_2", Vector3.new(22, 5, 55), Color3.fromRGB(235, 67, 67), "Red")

local serverScript = Instance.new("Script")
serverScript.Name = "OceanCannonSoccerServer"
serverScript.Source = [[
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Workspace = game:GetService("Workspace")

local root = Workspace:WaitForChild("OceanCannonSoccer")
local boatsFolder = root:WaitForChild("Boats")
local ball = root:WaitForChild("Cannonball")
local remote = ReplicatedStorage:WaitForChild("OceanCannonSoccer"):WaitForChild("Remotes"):WaitForChild("BoatControl")

local scores = { Blue = 0, Red = 0 }
local controls = {}
local assignments = {}
local spawnPositions = {}
local lastGoalAt = 0

for _, boat in ipairs(boatsFolder:GetChildren()) do
	if boat:IsA("Model") and boat.PrimaryPart then
		spawnPositions[boat] = boat.PrimaryPart.CFrame
	end
end

local function resetBall()
	ball.AssemblyLinearVelocity = Vector3.zero
	ball.AssemblyAngularVelocity = Vector3.zero
	ball.CFrame = CFrame.new(ball:GetAttribute("SpawnPosition") or Vector3.new(0, 6, 0))
end

local function resetBoats()
	for boat, cframe in pairs(spawnPositions) do
		if boat.Parent and boat.PrimaryPart then
			boat.PrimaryPart.AssemblyLinearVelocity = Vector3.zero
			boat.PrimaryPart.AssemblyAngularVelocity = Vector3.zero
			boat:PivotTo(cframe)
		end
	end
end

local function chooseBoat(player)
	local available = {}
	for _, boat in ipairs(boatsFolder:GetChildren()) do
		if boat:IsA("Model") and not boat:GetAttribute("DriverUserId") then
			table.insert(available, boat)
		end
	end
	table.sort(available, function(a, b)
		return a.Name < b.Name
	end)
	local boat = available[1]
	if not boat then
		return nil
	end
	boat:SetAttribute("DriverUserId", player.UserId)
	assignments[player] = boat
	return boat
end

local function seatPlayer(player, boat)
	local seat = boat and boat:FindFirstChild("CaptainSeat")
	if not seat then
		return
	end
	local character = player.Character or player.CharacterAdded:Wait()
	local humanoid = character:FindFirstChildOfClass("Humanoid")
	local rootPart = character:FindFirstChild("HumanoidRootPart")
	if humanoid and rootPart then
		rootPart.CFrame = seat.CFrame + Vector3.new(0, 3, 0)
		task.wait(0.15)
		seat:Sit(humanoid)
	end
end

local function setupPlayer(player)
	controls[player] = { throttle = 0, steer = 0, boost = false }
	local boat = chooseBoat(player)
	player.CharacterAdded:Connect(function()
		task.wait(0.35)
		seatPlayer(player, assignments[player] or boat)
	end)
	if player.Character then
		task.defer(seatPlayer, player, boat)
	end
end

Players.PlayerAdded:Connect(setupPlayer)
Players.PlayerRemoving:Connect(function(player)
	controls[player] = nil
	local boat = assignments[player]
	if boat then
		boat:SetAttribute("DriverUserId", nil)
	end
	assignments[player] = nil
end)

for _, player in ipairs(Players:GetPlayers()) do
	setupPlayer(player)
end

remote.OnServerEvent:Connect(function(player, payload)
	if typeof(payload) ~= "table" or not controls[player] then
		return
	end
	controls[player].throttle = math.clamp(tonumber(payload.throttle) or 0, -1, 1)
	controls[player].steer = math.clamp(tonumber(payload.steer) or 0, -1, 1)
	controls[player].boost = payload.boost == true
end)

local function score(team)
	if os.clock() - lastGoalAt < 2 then
		return
	end
	lastGoalAt = os.clock()
	scores[team] += 1
	print(("GOAL for %s! Blue %d x %d Red"):format(team, scores.Blue, scores.Red))
	resetBall()
	resetBoats()
end

ball.Touched:Connect(function(hit)
	local scoreFor = hit:GetAttribute("ScoreGoalFor")
	if scoreFor == "Blue" or scoreFor == "Red" then
		score(scoreFor)
		return
	end
	local hitStrength = hit:GetAttribute("HitStrength")
	if hitStrength and hit:IsA("BasePart") then
		local direction = (ball.Position - hit.Position)
		if direction.Magnitude > 0.1 then
			ball:ApplyImpulse(direction.Unit * ball.AssemblyMass * 135 * hitStrength)
		end
	end
end)

RunService.Heartbeat:Connect(function(dt)
	for player, control in pairs(controls) do
		local boat = assignments[player]
		if boat and boat.PrimaryPart then
			local hull = boat.PrimaryPart
			local thrust = hull:FindFirstChild("BoatThrust")
			local rudder = hull:FindFirstChild("RudderTurn")
			local stabilizer = hull:FindFirstChild("Stabilizer")
			local maxSpeed = boat:GetAttribute("MaxSpeed") or 70
			local boostForce = boat:GetAttribute("BoostForce") or 105
			local turnSpeed = boat:GetAttribute("TurnSpeed") or 2.6
			local speedForce = control.boost and boostForce or maxSpeed
			local forward = hull.CFrame.LookVector
			local planarVelocity = Vector3.new(hull.AssemblyLinearVelocity.X, 0, hull.AssemblyLinearVelocity.Z)
			local drag = -planarVelocity * hull.AssemblyMass * 1.55
			local drive = forward * hull.AssemblyMass * speedForce * control.throttle
			local bob = Vector3.new(0, math.sin(os.clock() * 2.5 + hull.Position.X) * hull.AssemblyMass * 1.2, 0)

			if thrust then
				thrust.Force = drive + drag + bob
			end
			if rudder then
				local turnMultiplier = math.clamp(planarVelocity.Magnitude / 18, 0.35, 1.45)
				rudder.AngularVelocity = Vector3.new(0, -control.steer * turnSpeed * turnMultiplier, 0)
			end
			if stabilizer then
				local _, yaw = hull.CFrame:ToOrientation()
				stabilizer.CFrame = CFrame.Angles(0, yaw, 0)
			end
		end
	end
	local buoyancy = ball:FindFirstChild("CannonballBuoyancy")
	if buoyancy then
		local lift = ball.Position.Y < 5.2 and 1.25 or 0.18
		buoyancy.Force = Vector3.new(0, ball.AssemblyMass * Workspace.Gravity * lift, 0)
	end
	if ball.Position.Y < -20 or math.abs(ball.Position.X) > 180 or math.abs(ball.Position.Z) > 210 then
		resetBall()
	end
end)
]]
serverScript.Parent = ServerScriptService

local clientScript = Instance.new("LocalScript")
clientScript.Name = "BoatControlsClient"
clientScript.Source = [[
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local remote = ReplicatedStorage:WaitForChild("OceanCannonSoccer"):WaitForChild("Remotes"):WaitForChild("BoatControl")

local keys = {}

local function setKey(input, value)
	if input.KeyCode == Enum.KeyCode.W or input.KeyCode == Enum.KeyCode.Up then
		keys.forward = value
	elseif input.KeyCode == Enum.KeyCode.S or input.KeyCode == Enum.KeyCode.Down then
		keys.back = value
	elseif input.KeyCode == Enum.KeyCode.A or input.KeyCode == Enum.KeyCode.Left then
		keys.left = value
	elseif input.KeyCode == Enum.KeyCode.D or input.KeyCode == Enum.KeyCode.Right then
		keys.right = value
	elseif input.KeyCode == Enum.KeyCode.LeftShift or input.KeyCode == Enum.KeyCode.ButtonR2 then
		keys.boost = value
	end
end

UserInputService.InputBegan:Connect(function(input, processed)
	if processed then
		return
	end
	setKey(input, true)
end)

UserInputService.InputEnded:Connect(function(input)
	setKey(input, false)
end)

local elapsed = 0
RunService.RenderStepped:Connect(function(dt)
	elapsed += dt
	if elapsed < 1 / 20 then
		return
	end
	elapsed = 0
	local throttle = (keys.forward and 1 or 0) + (keys.back and -0.55 or 0)
	local steer = (keys.left and -1 or 0) + (keys.right and 1 or 0)
	remote:FireServer({
		throttle = throttle,
		steer = steer,
		boost = keys.boost == true,
	})
end)
]]
clientScript.Parent = StarterPlayer.StarterPlayerScripts

Lighting.ClockTime = 14.2
Lighting.Brightness = 2.1
Lighting.Ambient = Color3.fromRGB(95, 116, 126)
Lighting.OutdoorAmbient = Color3.fromRGB(95, 135, 150)

local sky = Instance.new("Sky")
sky.Name = "BrightOceanSky"
sky.SkyboxBk = "rbxassetid://6412503613"
sky.SkyboxDn = "rbxassetid://6412503613"
sky.SkyboxFt = "rbxassetid://6412503613"
sky.SkyboxLf = "rbxassetid://6412503613"
sky.SkyboxRt = "rbxassetid://6412503613"
sky.SkyboxUp = "rbxassetid://6412503613"
sky.Parent = Lighting

local camera = Workspace.CurrentCamera
if camera then
	camera.CameraType = Enum.CameraType.Custom
	camera.CFrame = CFrame.new(0, 120, 190) * CFrame.Angles(math.rad(-35), 0, 0)
end

print("Ocean Cannon Soccer criado. Use Play para testar os barcos. W/S aceleram, A/D viram, Shift ativa boost.")
