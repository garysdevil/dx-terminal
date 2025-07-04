import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  BaseURIUpdated as BaseURIUpdatedEvent,
  ETHWithdrawn as ETHWithdrawnEvent,
  MintingPause as MintingPauseEvent,
  MintingPeriodScheduled as MintingPeriodScheduledEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PaymentRecipientUpdated as PaymentRecipientUpdatedEvent,
  Transfer as TransferEvent
} from "../generated/DXTerminal/DXTerminal"
import {
  Approval,
  ApprovalForAll,
  BaseURIUpdated,
  ETHWithdrawn,
  MintingPause,
  MintingPeriodScheduled,
  OwnershipTransferred,
  PaymentRecipientUpdated,
  Transfer,
  GlobalTransferCount
} from "../generated/schema"
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBaseURIUpdated(event: BaseURIUpdatedEvent): void {
  let entity = new BaseURIUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newBaseURI = event.params.newBaseURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleETHWithdrawn(event: ETHWithdrawnEvent): void {
  let entity = new ETHWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMintingPause(event: MintingPauseEvent): void {
  let entity = new MintingPause(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.startTime = event.params.startTime
  entity.endTime = event.params.endTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMintingPeriodScheduled(
  event: MintingPeriodScheduledEvent
): void {
  let entity = new MintingPeriodScheduled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.startTime = event.params.startTime
  entity.endTime = event.params.endTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaymentRecipientUpdated(
  event: PaymentRecipientUpdatedEvent
): void {
  let entity = new PaymentRecipientUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldRecipient = event.params.oldRecipient
  entity.newRecipient = event.params.newRecipient

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

// 将时间戳转换为日期（YYYYMMDD 格式）
function getDay(timestamp: BigInt): string {
  let timestampSeconds = timestamp.toI32();
  let date = new Date(timestampSeconds * 1000); // 转换为毫秒
  return date.toISOString().slice(0, 10).replace("-", ""); // 输出 YYYYMMDD
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // 计算日期（例如 20250702）
  let day = getDay(event.block.timestamp);
  let entityId = `global-${day}`; // 例如 "global-20250702"

  // 更新 GlobalTransferCount 实体
  let globalTransferCount = GlobalTransferCount.load(entityId);

  if (globalTransferCount == null) {
    // 如果实体不存在，创建新实体
    globalTransferCount = new GlobalTransferCount(entityId);
    globalTransferCount.count = BigInt.fromI32(1); // 初始计数为 1
    globalTransferCount.lastUpdated = event.block.timestamp;
  } else {
    // 如果实体存在，增加计数
    globalTransferCount.count = globalTransferCount.count.plus(BigInt.fromI32(1));
    globalTransferCount.lastUpdated = event.block.timestamp;
  }

  globalTransferCount.save();
}